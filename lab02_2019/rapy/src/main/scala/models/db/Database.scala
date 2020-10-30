package models.db

import java.io._

import org.json4s.JValue
import org.json4s.native.JsonMethods.parse
import org.json4s.native.Serialization

import scala.util.{Success, Try}
import scala.io.Source

import models._

object Database {
  var baseDir: String = "db"
  private[models] val locations = new DatabaseTable[Location]("locations.json")
  private[models] val consumers = new DatabaseTable[Consumer]("consumers.json")
  private[models] val providers = new DatabaseTable[Provider]("providers.json")
  private[models] val items     = new DatabaseTable[Item]("items.json")
  private[models] val orders    = new DatabaseTable[Order]("orders.json")

  private val databases = List(
    (locations, Location),
    (consumers, Consumer),
    (providers, Provider),
    (items, Item),
    (orders, Order)
  )

  private def loadDatabaseTable(file: String): Try[List[JValue]] = Try {
    val source = Source.fromFile(file)
    val jsonData = source.getLines.mkString
    source.close()
    parse(jsonData).extract[List[JValue]]
  }

  private[db] def saveDatabaseTable[M <: Model[M]](db: DatabaseTable[M]): Try[Unit] = Try {
    val pw = new PrintWriter(new File(baseDir, db.filename))
    pw.write(Serialization.write(db.instances.map(dbInstance => dbInstance._2.toMap)))
    pw.close()
  }

  def loadDatabase(directory: String = "db"): Unit = {
    baseDir = directory
    databases.foreach {
      case (db, factory) => loadDatabaseTable(s"$baseDir/${db.filename}") match {
        case Success(jsonList) => jsonList.foreach(jsonValue => factory(jsonValue).save())
        case _ => // Ignore
      }
    }
  }
}

