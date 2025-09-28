import React, { useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Category from "./Category";
import LatestJob from "./LatestJob";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const {user}= useSelector(store=>store.auth);
  const navigate= useNavigate();
  useEffect(()=>{
if(user?.role === 'recruiter'){

  navigate("/admin/companies");

}
  },[])
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Category />
      <LatestJob />
      <Footer />
    </div>
  );
};

export default Home;
