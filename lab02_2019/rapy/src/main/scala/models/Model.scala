package models

trait ModelCompanion[M <: Model[M]] {
  protected def dbTable: DatabaseTable[M]

  private[models] def apply(jsonValue: JValue): M

  def all: List[M] = dbTable.instances.values.toList

  def find(id: Int): Option[M] = all.find(m => m.id == id)

  /* Given an attribute with its value, find its id. Previously, we know that the element
     exists.
  */
  def getId(attr: String, value: Any): Int =
    all.filter(in =>
      in.toMap.keys.exists(_ == attr) && in.toMap(attr) == value
    ).head.id

  def exists(attr: String, value: Any): Boolean =
    all.exists { case m => 
      m.toMap.keys.exists(_ == attr) && m.toMap(attr) == value
    }

  /* delete() from "DatabaseTable.scala". */
  def delete(id: Int): Unit = dbTable.delete(id)

  def filter(mapOfAttributes: Map[String, Any]): List[M] = 
    mapOfAttributes.toList.filter { case (attr, value) => 
      exists(attr, value)
    }.map { case (attr, value) => all.filter( m => m.toMap.keys.exists( _ == attr) && m.toMap(attr) == value)
    }.flatten

}

trait Model[M <: Model[M]] { self: M =>
  protected var _id: Int = 0

  def id: Int = _id

  protected def dbTable: DatabaseTable[M]

  def toMap: Map[String, Any] = Map("id" -> _id)

  def save(): Unit = {
    if (_id == 0) { _id = dbTable.getNextId }
    dbTable.save(this)
  }
}
