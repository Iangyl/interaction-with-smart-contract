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
  private _balance: string;
  public read: string;
  public contractAddr: string;
  private _contract: any;
  public message: any;
  public Contract: any;
  private _provider: any;
  private _byteCode: any;
  private _signer: any;
  public isConnected: boolean;
  public isDeployed: boolean;


  constructor(
    private _http: HttpClient
  ) {
    this.account = '';
    this._balance = '';
    this.read = '';
    this.contractAddr = '0xa5D02E2B56F319Ea77d8aD4Ba73724C43fd2de7A';
    this.message = '';
    this.isConnected = false;
    this.isDeployed = false;
  }

  async ngOnInit() {
    this._contract = require("../assets/contracts/HelloWorld.json");
    this._byteCode = require("../assets/contracts/HelloWorldBC.json");
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    this._signer = this._provider.getSigner();
  }

  async getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.account = accounts[0];

    this._balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [this.account, 'latest']
    })
    this.read = (parseInt(this._balance) / 10 ** 18).toFixed(5);
    this.isConnected = true;
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
  async readData() {
    const helloWorldContract = this.createInstance(this.contractAddr);
    this.message = await helloWorldContract.functions.message();
  }

  async updateData(newMessage: string) {
    let hash = '';
    const helloWorldContract = this.createInstance(this.contractAddr);
    await helloWorldContract.functions.update(newMessage).then((txhash) => hash = txhash.hash);
    this._provider.once(hash, (tx: any) => {
      alert('Transaction confirmed!');
    })
  }

  createInstance(contractAddr: string) {
    return new ethers.Contract(contractAddr, this._contract.abi, this._signer);
  }
  getContractFromFactory() {
    return ethers.ContractFactory.fromSolidity(this._contract).connect(this._signer);
  }
  async getContractAddr() {
    const HelloWorld = await this.getContractFromFactory().deploy('Hello World!');
    this.contractAddr = HelloWorld.address;
    await HelloWorld.deployTransaction.wait();
    this.isDeployed = true;
  }
}
