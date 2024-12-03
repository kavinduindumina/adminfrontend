import { MDBDataTableV5, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBBtn,
} from "mdbreact";

const Passenger = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "ID",
        field: "id",
      },
      {
        label: "Profile Image",
        field: "profileImage",
        width: 100,
      },
      {
        label: "Full Name",
        field: "fullName",
        width: 100,
      },
      {
        label: "Email",
        field: "email",
        width: 100,
      },
      {
        label: "Phone",
        field: "phone",
        width: 100,
      },
      {
        label: "Address",
        field: "address",
        width: 50,
      },
      {
        label: "Registration Type",
        field: "status",
        width: 100,
      },
      {
        label: "Created At",
        field: "createdAt",
      },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
        width: 200,
      },
    ],
    rows: [],
  });

  const [isloading, setIsloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);

  // Function to handle showing modal and fetching passenger details
  const handleShowModal = (passengerId) => {
    setIsloading(true);
    axios
      .get(`https://localhost:7248/api/Customer/${id}`)
      .then((response) => {
        setSelectedPassenger(response.data.$values); // Set the fetched passenger details
        setShowModal(true); // Show the modal
        setIsloading(false);
      })
      .catch((error) => {
        toast.error("Error fetching Customer details");
        setIsloading(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPassenger(null);
  };



  const deletePassenger = (passengerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://localhost:7248/api/Customer/${id}`
          )
          .then((response) => {
            toast.success(response.data.message);
            // Fetch data again
            window.location.reload();
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    });
  }

  useEffect(() => {
    setIsloading(true);
    axios
      .get("https://localhost:7248/api/Customer")
      .then((response) => {
        const data = response.data.$values;
        const rows = data.map((row) => {
          return {
            id: row.id,
            profileImage: (
              <img
                src={row.profileImage}
                alt={row.fullName}
                style={{ width: "25px", height: "25px", borderRadius: "50%" }}
              />
            ),
            fullName: row.name,
            email: row.email,
            phone: row.mobileNumber,
            address: row.address,
            status: (
              <span
                className={`badge badge-${
                  row.isTemporary === true ? "success" : "dark"
                }`}
              >
                {row.isTemporary === true ? "By Operator" : "Self Registration"}
              </span>
            ),
            createdAt: new Date(row.createdAt).toLocaleString(),
            actions: (
              <MDBDropdown>
                <MDBDropdownToggle caret style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }}  className="btn btn-sm btn-secondary">
                  <i className="fas fa-ellipsis-v"></i>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                  <Link to={`/dashboard/passengers/edit/${row.id}`} className="dropdown-item">
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                  </MDBDropdownItem>
                  <MDBDropdownItem onClick={() => handleShowModal(row.id)}>
                    <i className="fas fa-eye"></i> View Details
                  </MDBDropdownItem>
                  <MDBDropdownItem onClick={() => deletePassenger(row.id)}>
                    <i className="fas fa-trash"></i> Delete
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            ),
          };
        });
        setDatatable((prevState) => {
          return { ...prevState, rows: rows };
        });
        setIsloading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <>
      <div className="card shadow" style={{ marginBottom:"150px" }}>
        <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
          <Link to="/dashboard">
            <i className="fas fa-arrow-left"></i>{" "}
          </Link>
          <h6 className="m-0 font-weight-bold text-primary">All Customers</h6>
          <Link
            to="/dashboard/passengers/add"
            className="btn btn-sm btn-primary"
          >
            Add Customer
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {isloading ? (
              <div className="spinner-border text-primary" role="status"></div>
            ) : (
              <MDBDataTableV5
                hover
                entriesOptions={[5, 20, 25]}
                entries={5}
                pagesAmount={4}
                data={datatable}
                searchTop
                searchBottom={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* MDB Modal */}
      <MDBModal isOpen={showModal} toggle={handleCloseModal} centered>
        <MDBModalHeader toggle={handleCloseModal}>
          Customer Details
        </MDBModalHeader>
        <MDBModalBody>
          {selectedPassenger ? (
            <>
              <h5>Customer Information</h5>
              <ul>
                <li>
                  <strong>ID:</strong> {selectedPassenger.id}
                </li>
                <li>
                  <strong>Full Name:</strong> {selectedPassenger.fullName}
                </li>
                <li>
                  <strong>Email:</strong> {selectedPassenger.email}
                </li>
                <li>
                  <strong>Phone:</strong> {selectedPassenger.phone}
                </li>
                <li>
                  <strong>Address:</strong> {selectedPassenger.address}
                </li>
                <li>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedPassenger.createdAt).toLocaleString()}
                </li>
                <li>
                  <strong>Status:</strong> <span className={`badge badge-${selectedPassenger.status === "active" ? "success" : "danger"}`}>
              {selectedPassenger.status}
            </span>
                </li>
              </ul>

              {selectedPassenger.operator ? (
                <>
                  <h5>Registered By Operator</h5>
                  <ul>
                    <li>
                      <strong>Operator ID:</strong>{" "}
                      {selectedPassenger.operator.id}
                    </li>
                    <li>
                      <strong>Full Name:</strong>{" "}
                      {selectedPassenger.operator.fullName}
                    </li>
                    <li>
                      <strong>Email:</strong> {selectedPassenger.operator.email}
                    </li>
                    <li>
                      <strong>Phone:</strong> {selectedPassenger.operator.phone}
                    </li>
                    <li>
                      <strong>Address:</strong>{" "}
                      {selectedPassenger.operator.address}
                    </li>
                  </ul>
                </>
              ) : (
                <p>
                  <center><strong>{selectedPassenger.admin ? "This Customer is Registered by Administrator" : "This customer is self-registered."}</strong></center>
                </p> // Display this if no operator
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={handleCloseModal}>
            Close
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};

export default Passenger;
