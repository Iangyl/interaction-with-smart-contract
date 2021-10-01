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
  public account:        string;
  private _balance:      string;
  public read:           string;
  private _contractAddr: string;
  private _contract:     any;
  public message:        string;
  public Contract:       any;
  private _provider:     any;
  private _byteCode:     any;
  private _signer:       any;


  constructor(
    private _http: HttpClient
  ) {
    this.account = '';
    this._balance = '';
    this.read = '';
    this._contractAddr = '0xd9145CCE52D386f254917e481eB44e9943F39138';
    this.message = '';
  }

  async ngOnInit() {
    this._contract =  require("../assets/contracts/HelloWorld.json");
    this._byteCode =  require("../assets/contracts/HelloWorldBC.json");
    this._provider =  new ethers.providers.Web3Provider(window.ethereum);
    this._signer   =  this._provider.getSigner();
    //this.contract = this._http.get("../assets/contracts/HelloWorldalt.json");
    //console.log(this._contract.abi);

    //this.message = await HelloWorld.message;
  }

  async getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.account = accounts[0]; //showAcc

    this._balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [this.account, 'latest']
    })
    //showBalance
    this.read = (parseInt(this._balance) / 10 ** 18).toFixed(5);
  }
  sendEth() {
    ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: this.account,
          to: this._contractAddr,
        }

      ],
    })
      .then((txHash: any) => console.log(txHash))
      .catch((error: any) => console.log(error.message))
  }
  async readData() {
    const helloWorldContract = this.createInstance(this._contractAddr);
    console.log(helloWorldContract.message());
    this.message = await helloWorldContract.message;
  }

  createInstance(contractAddr: string) {
    console.log(new ethers.Contract(contractAddr, this._contract.abi, this._signer));
    return  new ethers.Contract(contractAddr, this._contract.abi, this._signer);
  }
  getContractFromFactory() {
    return ethers.ContractFactory.fromSolidity(this._contract).connect(this._signer);
  }
  async getContractAddr(){
    const HelloWorld = await this.getContractFromFactory().deploy('Hello World!');
    console.log(HelloWorld);
    this._contractAddr = HelloWorld.address;
  }
}
