import React, { Component } from "react";
import LotteryContract from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";

import CardExampleCard from './display/ui'

import "./App.css";


class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null ,
        manager : '',
        round : '',
        winner: '',
        players: [],
        balance: 0,
        playerCounts: 0,
        currentAccount: '',
        isClicked: false,
        isShowButton:'',};

    async componentWillMount(){
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = LotteryContract.networks[networkId];
            const instance = new web3.eth.Contract(
                LotteryContract.abi,
                deployedNetwork.address,
            );
            let manager = await instance.methods.manager().call();
            let round = await instance.methods.round().call()
            let winner = await instance.methods.winner().call()
            let playerCounts = await instance.methods.getPlayersCount().call()

            //单位是wei，我们需要转换为ether单位
            let balanceWei = await instance.methods.getBalance().call()
            //从wei单位转换为'ether'单位
            let balance = web3.utils.fromWei(balanceWei, 'ether')

            let players = await instance.methods.getPlayers().call()

            let isShowButton = accounts[0] === manager ? 'inline' : 'none';

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3:web3,
                accounts:accounts,
                contract: instance,
                manager:manager,
                round:round,
                winner:winner,
                players:players,
                balance:balance,
                playerCounts:playerCounts,
                currentAccount:accounts[0],
                isShowButton:isShowButton,});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };
    play = async () => {
        // console.log('hello paly')
        const {web3, contract } = this.state;
        this.setState({
            isClicked:true
        })
        // let from = web3.eth.getAccounts();
        try{
            // alert(this.state.currentAccount);
            await contract.methods.play().send({
                from:this.state.currentAccount,
                value:web3.utils.toWei('1','ether'),
                gas:'3000000'
            });
            alert('投注成功');
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }catch(e){
            console.log(e);
            alert('投注失败');
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }
    };

    kaijiang = async () => {
        // console.log('hello paly')
        const {web3, contract } = this.state;
        this.setState({
            isClicked:true
        })
        // let from = web3.eth.getAccounts();
        try{
            // alert(this.state.currentAccount);
            await contract.methods.kaiJiang().send({
                from:this.state.currentAccount,
                // value:web3.utils.toWei('1','ether'),
                gas:'3000000'
            });
            let winner = await contract.methods.winner().call()
            alert(`开奖成功\n中奖人${winner}`);
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }catch(e){
            console.log(e);
            alert('开奖失败');
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }
    };

    tuijiang = async () => {
        // console.log('hello paly')
        const {web3, contract } = this.state;
        this.setState({
            isClicked:true
        })
        // let from = web3.eth.getAccounts();
        try{
            // alert(this.state.currentAccount);
            await contract.methods.tuiJiang().send({
                from:this.state.currentAccount,
                // value:web3.utils.toWei('1','ether'),
                gas:'3000000'
            });
            alert('退奖成功');
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }catch(e){
            console.log(e);
            alert('退奖失败');
            this.setState({
                isClicked:false
            })
            window.location.reload(true);
        }
    };

render() {
    if (!this.state.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <CardExampleCard
                manager={this.state.manager}
                round={this.state.round}
                winner={this.state.winner}
                players={this.state.players}
                balance={this.state.balance}
                playerCounts={this.state.playerCounts}
                currentAccount={this.state.currentAccount}
                play={this.play}
                kaijiang={this.kaijiang}
                tuijiang={this.tuijiang}
                isClicked={this.state.isClicked}
                isShowButton={this.state.isShowButton}
            />
            <p>manager:{this.state.manager}</p>
            <p>round:{this.state.round}</p>
            <p>winner:{this.state.winner}</p>
            <p>players:{this.state.players}</p>
            <p>balance:{this.state.balance}</p>
            <p>playerCounts:{this.state.playerCounts}</p>
            <p>currentAccount:{this.state.currentAccount}</p>
        </div>
);
}
}

export default App;
