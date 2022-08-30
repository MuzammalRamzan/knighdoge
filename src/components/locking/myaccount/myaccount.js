import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { contractAddress, abi } from "../../../utils/constant";
import "./myaccount.css";
import { ToastContainer, toast } from "react-toastify";

function Myaccount() {
  let accountAd;
  const [account, setAccount] = useState("Connect");
  const [WithdrawAbleReward, setWithdrawAbleReward] = useState(0);
  const [userstaked, setuserstaked] = useState(0);

  const getData = async () => {
    try {
      const web3 = window.web3;
      let contract = new web3.eth.Contract(abi, contractAddress);
      let uplinereward = await contract.methods
        .getUserAvailable(accountAd)
        .call();
      setWithdrawAbleReward(formatThousands(web3.utils.fromWei(uplinereward)));
      uplinereward = await contract.methods
        .getUserTotalDeposits(accountAd)
        .call();
      setuserstaked(web3.utils.fromWei(uplinereward));
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };
  function formatThousands(num) {
    var numbr = parseFloat(parseFloat(num).toFixed(6));
    var values = numbr.toString().split(".");
    return (
      values[0].replace(/.(?=(?:.{3})+$)/g, "$&,") +
      (values.length == 2 ? "." + values[1] : "")
    );
  }
  const loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
      }
      if (isConnected === true) {
        let accounts = await getAccounts();
        accountAd = accounts[0];
        setAccount(accountAd);
        let accountDetails = null;
        window.ethereum.on("accountsChanged", function (accounts) {
          accountAd = accounts[0];
          setAccount(accountAd);
        });
      }
      getData();
    } catch (error) {
      console.log("Error while connecting metamask", error);
      // alert("Error while connecting metamask");
    }
  };
  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      let accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };

  const WithdrawReward = async () => {
    try {
      if (WithdrawAbleReward > 0) {
        const web3 = window.web3;
        let contract = new web3.eth.Contract(abi, contractAddress);

        let uplinereward = await contract.methods
          .withdraw()
          .send({
            from: account,
          })
          .then(async (output) => {
            toast.success("Transaction Completed");
          })
          .catch((e) => {
            toast.error(e.message);
          });
      } else if (WithdrawAbleReward <= 0) {
        toast("Please recharge!! Your Balance is 0 or less than 0");
      }
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  function copyToClipboard(e) {
    try {
      let get = document.getElementById("textAreaRef").select();
      document.execCommand("copy");
      e.target.focus();
      toast.success("copied!");
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  }

  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 1000);
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-4">
          <div className="mystaked">
            <div className="row">
              <span className="mystakedtext">Withdrawable Reward12</span>
              <span className="mystakedvalue">{WithdrawAbleReward}</span>
              <span className="mystakedtext">User Total Deposit</span>
              <span className="mystakedvalue">{userstaked}</span>
              <button className="btn btn-warning" onClick={WithdrawReward}>
                Withdraw
              </button>
            </div>
          </div>
          <div className="row" style={{ color: "white" }}>
            <h1>Your Stake</h1>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="myrefferaltable">
            <span className="refferaltext">Your Referral Link</span>
            <div className="row">
              <div className="col-sm-10">
                <input
                  placeholder="Please connect to your wallet"
                  value={`${window.location.protocol}//${window.location.host}/login?ref=${account}`}
                />
              </div>
              <div className="col-sm-2">
                <button
                  className="copy"
                  id="textAreaRef"
                  onClick={copyToClipboard}
                >
                  copy
                </button>
              </div>
            </div>

            <div
              className="row"
              style={{
                padding: "10px 0px",
              }}
            >
              <div className="col">
                <p>Earn for promotion BNBstake</p>
                <p>You will receive:</p>
                <p>5% from each level 1 referral depositss</p>
                <p>2.5% from each level 2 referral deposits</p>
                <p>0.5% from each level 3 referral deposits</p>
                <p>
                  Note! You need to have at least 1 deposit to start receive
                  earnings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myaccount;
