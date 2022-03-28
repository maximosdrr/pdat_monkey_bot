import express, { Request, Response } from "express";
import { AppConfig } from "../config/env";

export class AuthServer {
  runServer() {
    const server = express();

    server.use(express.json());

    server.get("/auth", this.authenticate);

    server.listen(AppConfig.serverPort, () => {
      console.log("Auth Server listen port", AppConfig.serverPort);
    });
  }

  private authenticate(req: Request, res: Response) {
    console.log(req.params, req.query);

    res.send({ ok: true });
  }
}
