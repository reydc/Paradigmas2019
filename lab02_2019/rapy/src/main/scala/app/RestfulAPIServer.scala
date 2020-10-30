package app

import cask._
import models._
import upickle.default._

object RestfulAPIServer extends MainRoutes  {
  override def host: String = "0.0.0.0"
  override def port: Int = 4000

  /* This is necessary for serializing arrays of objects with named fields,
     from where we would extract some data for the orders.
  */
  private case class PairItemAmount(name: String, amount: Int) {
    def toPair: (String, Int) = (this.name, this.amount)
  }
  /* Companion Object for class PairItemAmount that declares a ReadWriter
     for pairs.
  */
  private object PairItemAmount {
    implicit val rw: ReadWriter[PairItemAmount] = macroRW
  }

  /* Root */
  /********/

  @get("/")
  def root(): Response = {
    JSONResponse("Ok")
  }

  /* Locations */
  /*************/

  /* 200 - [{name: string, coordX: int, coordY: int}] */
  @get("/api/locations")
  def locations(): Response = {
    JSONResponse(Location.all.map(location => location.toMap))
  }

  /* 200 - id ;
     409 - existing location name
  */
  @postJson("/api/locations")
  def postLocation(name: String, coordX: Int, coordY: Int): Response = {
    if (Location.exists("name", name)) {
      return JSONResponse("Existing location", 409)
    }

    val location = Location(name, coordX, coordY)
    location.save()
    JSONResponse(location.id)
  }

  /* Users */
  /************/

  /* 200 - [{id: int, username: string, locationId: int}] */
  @get("/api/consumers")
  def consumers(): Response = {
    JSONResponse(Consumer.all.map(user => user.toMap))
  }

  /* 200 - id ;
     404 - non existing location ;
     409 - existing username
  */
  @postJson("/api/consumers")
  def postConsumer(username: String, locationName: String): Response = {
    if (Consumer.exists("username", username)) {
      return JSONResponse("Existing username", 409)
    }
    if (!Location.exists("name", locationName)) {
      return JSONResponse("Non-existing location", 404)
    }

    val consumer = Consumer(username, locationName)
    consumer.save()
    JSONResponse(consumer.id)
  }

  /* 200 - [{id: int, username: string, locationId: int, storeName: string, maxDeliveryDistance: int}] ;
     404 - non existing location
  */
  /* See, to understand how to deal with these parameters,
     http://www.lihaoyi.com/cask/#variable-routes
  */
  @get("/api/providers")
  def providers(locationName: Option[String] = None): Response = locationName match {
    case Some(location) =>
      if (!Location.exists("name", location)) {
        return JSONResponse(s"Non-existing location", 404)
      }
      JSONResponse(
        Provider.all.filter(provider =>
          provider.locationName == location
        ).map(provider => provider.toMap)
      )
    case _ => /* None */
      JSONResponse(Provider.all.map(user => user.toMap))
  }

  /* 200 - id ;
     400 - negative maxDeliveryDistance ;
     404 - non existing location ;
     409 - existing username/storeName
  */
  @postJson("/api/providers")
  def postProvider(username: String,
                   storeName: String,
                   locationName: String,
                   maxDeliveryDistance: Int
                   ): Response = {

    if (maxDeliveryDistance < 0) {
      return JSONResponse("Negative maxDeliveryDistance", 400)
    }                  
    if (!Location.exists("name", locationName)) {
      return JSONResponse("Non-existing location", 404)
    }
    if (Provider.exists("username", username)) {
      return JSONResponse("Existing username", 409)
    }
    if (Provider.exists("storeName", storeName)) {
      return JSONResponse("Existing storeName", 409)
    }

    val provider = Provider(username, storeName, locationName, maxDeliveryDistance)
    provider.save()
    JSONResponse(provider.id)
  }

  /* 200 "Ok" ;
     404 - non existing user
  */
  @post("/api/users/delete/:username")
  def deleteUser(username: String): Response = {
    if (!Consumer.exists("username", username)
        && !Provider.exists("username", username)
       ) {
      return JSONResponse("Non-existing user", 404)
    }

    if (Consumer.exists("username", username)) {
      val id_user = Consumer.getId("username", username)
      Consumer.delete(id_user)
    } else {
      val id_user = Provider.getId("username", username)
      Provider.delete(id_user)
    }
    JSONResponse("OK")
  }

  /* Items */
  /*********/

  /* 200 - [{id: int, name: string, price: float, description: string, providerId: int}*] ;
     404 - non existing provider
  */
  @get("/api/items")
  /* Once again, http://www.lihaoyi.com/cask/#variable-routes */
  def items(providerUsername: Option[String] = None): Response = providerUsername match {
    case Some(provider) =>
      if (!Provider.exists("username", provider)) {
        return JSONResponse("Non-existing provider", 404)
      }
 
      val itemsWithId =
        Item.filter(Map("providerUsername" -> provider)
        ).map { case i =>
          i.toMap + ("providerid"  -> Provider.getId("username", provider))
        }
      JSONResponse(itemsWithId)
    case _ => /* None */
      /* If there isn't a providerUsername, return all items */
      JSONResponse(Item.all.map(item => item.toMap))
  }

  /* 200 - id ;
     400 - negative price ;
     404 - non existing provider ;
     409 - existing item for provider
  */
  @postJson("/api/items")
  def postItems(name: String,
               description: String,
               price: Float,
               providerUsername: String
               ): Response = {

    if (price < 0.0f) {
      return JSONResponse("Negative price", 400)
    }

    if (!Provider.exists("username", providerUsername)) {
      return JSONResponse("Non-existing provider", 404)
    }

    val itemsByUsername = Item.filter(Map("providerUsername" -> providerUsername))
    if (itemsByUsername.exists(item => item.name == name)) {
      return JSONResponse("Existing item for provider", 409)
    }

    val item = Item(name, description, price, providerUsername)
    item.save()
    JSONResponse(item.id)
  }

  /* 200 "Ok" ;
     404 - non existing item
  */
  @post("/api/items/delete/:id")
  def deleteItem(id: Int): Response = {
    if (!Item.exists("id", id)) {
      return JSONResponse("Non-existing item", 404)
    }
    
    Item.delete(id)
    JSONResponse("OK")
  }
  
  /* Orders */
  /**********/

  /* 200 - [{id: int, consumerId: int, consumerUsername: string, consumerLocation: string, 
       providerId: int, providerStoreName: string, orderTotal: float}*] ;
     404 - non existing user
  */
  @get("/api/orders")
  def orders(username: String): Response = {
    if (!Consumer.exists("username", username)
        && !Provider.exists("username", username)
        ) {
      return JSONResponse("Non-existing user", 404)
    }

    /* We already know that the user exists, now look for related orders
    */
    val userOrders =
    if (Consumer.exists("username", username)) {
      Order.filter(Map("consumerUsername" -> username)
        ).map { order =>
          /* Obtain consumer and provider, given a order */
          val consumer = Consumer.filter(Map("username" -> order.consumerUsername)).head
          val provider = Provider.filter(Map("username" -> order.providerUsername)).head
          Map("id"                -> order.id,
              "consumerId"        -> consumer.id,
              "consumerUsername"  -> consumer.username,
              "consumerLocation"  -> consumer.locationName,
              "providerId"        -> provider.id,
              "providerStoreName" -> provider.storeName,
              "status"            -> order.status.toString,
              "orderTotal"        -> order.items.filter {
                                       case (nameItem, e) => Item.exists("name", nameItem)
                                     }.foldRight(0.0f) {
                                       case ((nameItem, am), acc) =>
                                          acc +
                                          (am.toFloat * Item.find(Item.getId("name", nameItem)).get.price)
                                     }
              ) /* End Map */
        }
    } else {
      Order.filter(Map("providerUsername" -> username)
      ).map { order =>
        /* Obtain consumer and provider, given a orden */
        val consumer = Consumer.filter(Map("username" -> order.consumerUsername)).head
        val provider = Provider.filter(Map("username" -> order.providerUsername)).head
        Map("id"                -> order.id,
            "consumerId"        -> consumer.id,
            "consumerUsername"  -> consumer.username,
            "consumerLocation"  -> consumer.locationName,
            "providerId"        -> provider.id,
            "providerStoreName" -> provider.storeName,
            "status"            -> order.status.toString,
            "orderTotal"        -> order.items.filter {
                                     case (nameItem, e) => Item.exists("name", nameItem)
                                   }.foldRight(0.0f) {
                                     case ((nameItem, am), acc) =>
                                        acc +
                                        (am.toFloat * Item.find(Item.getId("name", nameItem)).get.price)
                                   }
            ) /* End Map */
      }
    }

    JSONResponse(userOrders)
  }

  /* 200 - [{id: int, name: string, description: string, price: float, amount: int}] ;
     404 - non existing order
  */
  @get("/api/orders/detail/:id")
  def ordersDetail(id: Int): Response = {
    if (!Order.exists("id", id)) {
      return JSONResponse("Non-existing order", 404)
    }
    
    val order = 
      Order.find(id).get.items.map {
        case (s, in) =>
          Item.filter(Map("name" -> s)).map { item =>
            Map("id"          -> item.id,
                "name"        -> item.name,
                "description" -> item.description,
                "price"       -> item.price,
                "amount"      -> in
                )
          }
      }.flatten
    
    JSONResponse(order)
  }

  /* 200 - id ;
     400 - negative amount ;
     404 - non existing consumer/provider/item for provider
  */
  @postJson("/api/orders")
  def postOrder(providerUsername: String,
                consumerUsername: String,
                items: Seq[PairItemAmount]
                ): Response = {
    val itemsAmounts = items.map(_.toPair).toList

    if (!Provider.exists("username", providerUsername)) {
      JSONResponse("Non-existing provider", 404)
    }

    if (!Consumer.exists("username", consumerUsername)) {
      JSONResponse("Non-existing consumer", 404)
    }

    if (!itemsAmounts.forall {case (name, am) => Item.exists("name", name)}) {
      JSONResponse("Non-existing item", 404)
    }

    if (!itemsAmounts.forall {case (name, am) => am >= 0}) {
      JSONResponse("Negative amount", 400)
    }
    /* This is an extra */
    if (!itemsAmounts.forall {
          case (name, am) =>
            Item.filter(Map("name" -> name)).head.providerUsername == providerUsername
        }) {
      JSONResponse("Some item has different provider", 400)
    }
    
    /* Total to pay */
    val total = itemsAmounts.map {
      case (name, am) =>
        am.toFloat * Item.find(Item.getId("name", name)).get.price
    }.fold(0.0f) {_ + _}

    /* Change the wallet's state of our friends */
    Consumer.filter(Map("username" -> consumerUsername)).head.pay(total)
    Provider.filter(Map("username" -> providerUsername)).head.getPaid(total)
    
    val order = Order(providerUsername, consumerUsername, itemsAmounts)
    order.save()
    JSONResponse(order.id)
  }

  /* 200 - "Ok" ;
     404 - non existing order
  */
  @post("/api/orders/delete/:id")
  def deleteOrder(id: Int): Response = {
    if (!Order.exists("id", id)) {
      return JSONResponse("Non-existing order", 404)
    }

    Order.delete(id)
    JSONResponse("OK")
  }

  /* 200 - "Ok" ;
     404 - non existing order
  */
  @post("/api/orders/deliver/:id")
  def deliver(id: Int): Response = {
    if (!Order.exists("id", id)) {
      JSONResponse("Non-existing order", 404)
    }

    Order.find(id).get.deliver
    JSONResponse("Ok")
  }

  /* Main */
  /********/

  override def main(args: Array[String]): Unit = {
    System.err.println("\n " + "=" * 39)
    System.err.println(s"| Server running at http://$host:$port ")

    if (args.length > 0) {
      val databaseDir = args(0)
      Database.loadDatabase(databaseDir)
      System.err.println(s"| Using database directory $databaseDir ")
    } else {
      Database.loadDatabase()  // Use default location
    }
    System.err.println(" " + "=" * 39 + "\n")

    super.main(args)
  }

  initialize()
}
