import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ethers } from "ethers";
declare let window: any;

const ethereum = window.ethereum;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public account: string;
  private balance: string;
  public read: string;
  private contractAddr: string;
  private contract: any;
  public message: string;


  constructor(
    private _http: HttpClient
  ) {
    this.account = '';
    this.balance = '';
    this.read = '';
    this.contractAddr = '0xd9145CCE52D386f254917e481eB44e9943F39138';
    this.message = '';
  }

  ngOnInit() {
    this.contract = this._http.get("../assets/contracts/HelloWorld.json");
    //console.log(JSON.stringify(this.contract));
  }

  async getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.account = accounts[0]; //showAcc

    this.balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [this.account, 'latest']
    })
    //showBalance
    this.read = (parseInt(this.balance) / 10 ** 18).toFixed(5);
  }
  sendEth() {
    ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.account,
          to: this.contractAddr,
        }

      ],
    })
    .then((txHash: any) => console.log(txHash))
    .catch((error: any) => console.log(error.message))
  }
}
