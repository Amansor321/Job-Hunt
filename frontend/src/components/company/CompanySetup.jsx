import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Description } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import axios from "axios";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
    const params = useParams();
  useGetCompanyById(params.id);
 
  const [input, setInput] = useState({
    name: "",
    Description: "",
    Location: "",
    website: "",
    file: null,
  });
const {singleCompany}= useSelector(store=>store.company);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.Description);
    formData.append("website", input.website);
    formData.append("location", input.Location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally{
      setLoading(false);
    }
  };


  useEffect(()=>{
    setInput({
       name: singleCompany.name ||"",
    Description: singleCompany.description ||"",
    Location: singleCompany.Location ||"",
    website: singleCompany.website ||"",
    file: singleCompany.file || null,

    })
  },[singleCompany])

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button onClick={()=>navigate("/admin/companies")}
              className="flex items-center gap-2 text-gray-500 font-semibold"
              variant="outline"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CompanyName</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="Location"
                value={input.Location}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>
         {loading ? (
            <Button className="w-full mr-2 h-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 ">
             Update
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
