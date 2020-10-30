package models

/* Enumeration for order status.
   See: https://pedrorijo.com/blog/scala-enums/
        https://underscore.io/blog/posts/2014/09/03/enumerations.html
*/
sealed abstract class Status(val enum: Int) {
  def compare(that: Status) = this.enum - that.enum
}
/* This enumeration will only be accessible for this package and
   any other package that imports it.
*/
private[models] case object Payed extends Status(0) {
  override def toString: String = "payed"
}
private[models] case object Delivered extends Status(1) {
  override def toString: String = "delivered" 
}

object Order extends ModelCompanion[Order]{
  protected def dbTable: DatabaseTable[Order] = Database.orders

  def apply(providerUsername: String,
            consumerUsername: String,
            items: List[(String, Int)]
            ): Order =
    new Order(providerUsername, consumerUsername, items)

  private[models] def apply(jsonValue: JValue): Order = {
    val value = jsonValue.extract[Order]
    value._id = (jsonValue \ "id").extract[Int]
    value.save()
    value
  }
}

class Order(val providerUsername: String,
            val consumerUsername: String,
            val items: List[(String, Int)],
            var status: Status = Payed
            ) extends Model[Order] {
  protected def dbTable: DatabaseTable[Order] = Order.dbTable
  
  /* Change status */
  def deliver: Unit = { this.status = Delivered }

  /* Check if the order has been delivered */
  def isDelivered: Boolean = { this.status.compare(Delivered) == 0 }

  override def toMap: Map[String, Any] =
    super.toMap + ("providerUsername" -> providerUsername,
                   "consumerUsername" -> consumerUsername,
                   "items" -> items,
                   "status" -> status)

  override def toString: String = s"Consumer: $consumerUsername ->Order-> Provider: $providerUsername"
}