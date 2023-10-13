import { Connection } from 'typeorm';

export class ConnectionStore {
  private static connection: Connection;

  static setConnection(conn: Connection) {
    this.connection = conn;
  }

  static getConnection(): Connection {
    return this.connection;
  }
}
