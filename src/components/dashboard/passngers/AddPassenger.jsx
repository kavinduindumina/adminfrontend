import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUploader from "../../utils/ImageUploader";

const AddPassenger = () => {

  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [imageUrls, setImageUrl] = useState([]);

  const handleImageUrlChange = (newImageUrl) => {
    setImageUrl(newImageUrl);
  }

  useEffect(() => {
    if(id){
      axios.get(`https://localhost:7248/api/Customer/${id}`)
      .then((response) => {
        const data = response.data.$values[0];        
        setEmail(data.email);
        setFullName(data.name);
        setPhoneNumber(data.mobileNumber);
        setAddress(data.address);
        setImageUrl(data.image);
        setDate(data.createdAt);
        setIsloading(false);

      })
      .catch((error) => {
        setIsloading(false);
        toast.error("Error fetching passenger: " + error);
      });
    }
  }, [id])

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const response = await axios.post("https://localhost:7248/api/Customer/register", {
        fullname,
        email, 
        phone,
        address,
        profileImage: imageUrls,
        adminID:"1",
        registeredby: true,
      });
      if (response.status === 200) {
        setIsloading(false);
        toast.success("Customer added successfully");
        setEmail("");
        setFullName("");
        setPhoneNumber("");
        setAddress("");
        setImageUrl([]);
      }
    } catch (error) {
      setIsloading(false);
      toast.error("Error adding passenger: " + error);
    }
  };

  const onEdit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const response = await axios.put(
        `https://localhost:7248/api/Customer/${id}`,
        {
          name: fullname,
          email,
          mobileNumber: phone,
          address,
          profileImage: imageUrls,
          adminID:"1",
          registeredby: true,
        }
      );
      if (response.status === 200) {
        setIsloading(false);
        toast.success("Customer updated successfully");
        setEmail("");
        setFullName("");
        setPhoneNumber("");
        setAddress("");
        setImageUrl([]);
      }
    } catch (error) {
      setIsloading(false);
      toast.error("Error updating Customer: " + error);
    }
  };

  return (
    <div className="card shadow" style={{ marginBottom: "250px" }}>
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <Link to="/dashboard/passengers">
          <i className="fas fa-arrow-left"></i>{" "}
        </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? "Update Customer" : "Add new Customer"}
        </h6>
        <div>{""}</div>
      </div>
      <div className="card-body">
        <div>
          <div className="row mb-4">
            <div className="col">
              <label className="form-label" htmlFor="">
                Profile Picture
              </label>
              <ImageUploader onImageUrlChange={handleImageUrlChange}/>
            </div>
          </div>
          <form>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example6">
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="form6Example6"
                    className="form-control"
                    value="kavindu@gmail.com"
                    //value={email}
                    //onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Name
                  </label>
                  <input
                    type="text"
                    id="form6Example7"
                    className="form-control"
                    value="Kavindu Indumina"
                    // value={fullname}
                    // onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                {/* <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example6">
                    National ID Number / Passport Number
                  </label>
                  <input
                    type="text"
                    id="form6Example6"
                    className="form-control"
                    value={nic}
                    onChange={(e) => setNationalID(e.target.value)}
                  />
                </div> */}
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="form6Example7"
                    className="form-control"
                    value="0767668187"
                    // value={phone}
                    // onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Address
                  </label>
                  <input
                    type="text"
                    id="form6Example7"
                    className="form-control"
                    value="Udugama, Galle"
                    // value={address}
                    // onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Last Updated At
                  </label>
                  <input
                    type="text"
                    id="form6Example7"
                    className="form-control"
                    value="2024-11-12 14:31:21"
                    // value={date ? new Date(date).toLocaleString() : ""}
                    // disabled={true}
                  />
                </div>
              </div>
            </div>

            <button
              data-mdb-ripple-init
              type="button"
              className={
                isloading
                  ? "btn btn-primary btn-block disabled"
                  : "btn btn-primary btn-block"
              }
              onClick={
                id
                  ? (e) => {
                      onEdit(e);
                    }
                  : (e) => {
                      onSubmit(e);
                    }
              }
            >
              {isloading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Save Customer"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPassenger;
