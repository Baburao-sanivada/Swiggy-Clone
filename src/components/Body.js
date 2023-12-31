import { useState,useEffect, useContext } from "react";
import obj from "../utils/data";
import Card,{CardWithLabel} from "./Card";
import { Shimmer } from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";
import { UserContext } from "../utils/UserContext";


export const Body=()=>{
    const [ResList,SetResList]=useState([]);
    const [resList,SetresList]=useState([]);
    const [InputVal,setInputValue]=useState("");
    useEffect(()=>{
        fetchData();
    },[]);
    const fetchData=async () => {
        const data=await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=17.5047744&lng=78.3799564&collection=83649&tags=layout_CCS_Biryani&sortBy=&filters=&type=rcv2&offset=0&page_type=null");
        const json=await data.json();
        // console.log(json);
        SetresList(json.data.cards.slice(3,));
        SetResList(json.data.cards.slice(3,));
    }
    const {user,setUserName}=useContext(UserContext);
    const WithPromotedLabel=CardWithLabel(Card);
    
    const onlinestatus=useOnlineStatus();
    if(onlinestatus===false){
        return <h1>You're are Offline!!! Please Check Your Internet</h1>
    }
    //Conditional Rendering
    return resList.length===0?<Shimmer></Shimmer>: (
        <div className="res-container">
            <div className="Search my-4 p-4 pl-10 flex">
                <input  data-testid="searchelement" className="border border-solid border-black m-2" type="text" id="inputtext" placeholder="Select Restaurant" value={InputVal} onChange={(e)=>{
                    setInputValue(e.target.value);
                }}></input>
                <button className="px-4 bg-green-100 py-1 rounded-lg mx-4" onClick={()=>{
                    // console.log(ResList);
                    const updatedList=ResList.filter((item)=>{
                        return item.card.card.info.name.toLowerCase().includes(InputVal.toLowerCase());
                    })
                    SetresList(updatedList);
                }}>Search</button>

                <div className="ml-4">
                    <label>UserName : </label>
                    <input className="border border-black" value={user} onChange={(e)=>{
                        setUserName(e.target.value);
                    }}></input>
                </div>
            </div>
            <div className="flex flex-wrap">
            {
                resList.map((item)=>
                <Link key={item.card.card.info.id} to={"/restaurant/"+item.card.card.info.id} >{
                    item.card.card.info.promoted?<WithPromotedLabel data={item}></WithPromotedLabel>:<Card data={item}></Card>
                }</Link>
                )
            }
            </div>
        </div>
    )
}

export default Body;