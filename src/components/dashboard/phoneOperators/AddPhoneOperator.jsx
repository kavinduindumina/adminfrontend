import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const addPhoneOperator = () => {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [nic, setNationalID] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isloading, setLoading] = useState(false);
  const [allUsernames, setAllUsernames] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !fullName || !nic || !phone || !address) {
      toast.error("This email is already in use 😒");
      setLoading(false);
      return;
    }

    if(nic.length !== 10){
      toast.error("National ID should be 10 characters or more");
      setLoading(false);
      return;
    }

    if(phone.length !== 10){
      toast.error("Phone number should be 10 characters");
      setLoading(false);
      return;
    }

    await axios
      .post("http://localhost:3000/api/v1/admin/add-phone-operator", {
        email,
        fullName,
        nic,
        phone,
        address,
      })
      .then((res) => {
        toast.success("Phone Operator added successfully");
        setEmail("");
        setFullName("");
        setNationalID("");
        setPhoneNumber("");
        setAddress("");
      })
      .catch((err) => {
        toast.error("Failed to add Phone Operator");
        console.log(err);
      });
    setLoading(false);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/phone-operator/get-all-usernames")
    .then((res) => {
      setAllUsernames(res.data.message);
    })
    .catch((err) => {
      console.log("Failed to phone numbers");
    });

    if (id) {
      axios
        .get(`http://localhost:3000/api/v1/phone-operator/profile/${id}`)
        .then((res) => {
          const data = res.data.message;
          setEmail(data.email);
          setFullName(data.fullName);
          setDate(data.updatedAt);
          setNationalID(data.nic);
          setPhoneNumber(data.phone);
          setAddress(data.address);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [])

  const onEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.put(`http://localhost:3000/api/v1/phone-operator/update-profile/${id}`, {
      email,
      fullName,
      nic,
      phone,
      address,
    })
    .then((res) => {
      toast.success("Phone Operator updated successfully");
    })
    .catch((err) => {
      toast.error("Failed to update Phone Operator");
      console.log(err);
    });

    setLoading(false);
  };

  return (
    <div className="card shadow" style={{ marginBottom: "250px" }}>
      <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
        <Link to="/dashboard/phoneOperators">
          <i className="fas fa-arrow-left"></i>{" "}
        </Link>
        <h6 className="m-0 font-weight-bold text-primary">
          {id ? "Update Phone Operator" : "Add new Phone Operator"}
        </h6>
        <div>{""}</div>
      </div>
      <div className="card-body">
        <div>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" htmlFor="form6Example7">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="form6Example7"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
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
                </div>
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
                    value={phone}
                    onChange={(e) => setPhoneNumber(e.target.value)}
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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
                    value={date ? new Date(date).toLocaleString() : ""}
                    disabled={true}
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
                "Save Phone Operator"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default addPhoneOperator;
