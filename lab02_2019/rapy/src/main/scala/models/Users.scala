package models

/* User interface */
sealed trait User {
  val username: String
  val locationName: String
  var balance: Float
}

/* Provider */
object Provider extends ModelCompanion[Provider] {
  protected def dbTable: DatabaseTable[Provider] = Database.providers
  
  def apply(username: String,
            storeName: String,
            locationName: String,
            maxDeliveryDistance: Int
            ): Provider =
    new Provider(username, storeName,locationName, maxDeliveryDistance)

  private[models] def apply(jsonValue: JValue): Provider = {
    val value = jsonValue.extract[Provider]
    value._id = (jsonValue \ "id").extract[Int]
    value.save()
    value
  }
}

class Provider(val username: String,
               val storeName: String,
               val locationName: String,
               val maxDeliveryDistance: Int,
               var balance: Float = 0.0f
               ) extends Model[Provider] with User {
  protected def dbTable: DatabaseTable[Provider] = Provider.dbTable

  def getPaid(money: Float): Unit = { this.balance += money }

  override def toMap: Map[String, Any] =
    super.toMap + ("username" -> username,
                   "storeName" -> storeName,
                   "locationName" -> locationName,
                   "maxDeliveryDistance" -> maxDeliveryDistance,
                   "balance" -> balance)

  override def toString: String = s"Provider: $username"
}

/* Consumer */
object Consumer extends ModelCompanion[Consumer] {
  protected def dbTable: DatabaseTable[Consumer] = Database.consumers
  
  def apply(username: String,
            locationName: String
            ): Consumer =
    new Consumer(username, locationName)
  
  private[models] def apply(jsonValue: JValue): Consumer = {
    val value = jsonValue.extract[Consumer]
    value._id = (jsonValue \ "id").extract[Int]
    value.save()
    value
  }
}

class Consumer(val username: String,
               val locationName: String,
               var balance: Float = 0.0f
               ) extends Model[Consumer] with User {
  protected def dbTable: DatabaseTable[Consumer] = Consumer.dbTable

  def pay(money: Float): Unit = { this.balance -= money }

  override def toMap: Map[String, Any] =
    super.toMap + ("username" -> username,
                   "locationName" -> locationName,
                   "balance" -> balance)

  override def toString: String = s"Consumer: $username"
}
