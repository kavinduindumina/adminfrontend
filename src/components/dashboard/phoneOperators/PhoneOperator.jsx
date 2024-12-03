import axios from "axios";
import { MDBDataTableV5, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem  } from "mdbreact";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const phoneOperator = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      {
        label: "ID",
        field: "id",
      },
      {
        label: "Full Name",
        field: "fullName",
        width: 150,
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Name",
        },
      },
      {
        label: "Email",
        field: "email",
        width: 200,
      },
      {
        label: "Phone",
        field: "phone",
        width: 100,
      },
      {
        label: "Address",
        field: "address",
        width: 150,
      },
      {
        label: "Status",
        field: "status",
      },
      {
        label: "Created At",
        field: "createdAt",
      },
      {
        label: "Actions",
        field: "actions",
        sort: "disabled",
        width: 100,
      },
    ],
    rows: [],
  });
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    setIsloading(true);
    axios.get("https://localhost:7248/api/Book")
      .then((response) => {
        const data = response.data.message;
        const rows = data.map((row) => {
          return {
            id: row.id,
            title: row.title,
            isbn: row.isbn,
            category: row.category.name,
            author: row.author.name,
            language: row.language,
            price: `$${row.price}`, // Assuming price is a number
            qty: row.qty,
            createdAt: new Date(row.createAt).toLocaleString(),
            actions: (
              <MDBDropdown>
                <MDBDropdownToggle caret color="secondary" style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} className="btn btn-sm">
                <i className="fas fa-ellipsis-v"></i>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <Link to={`/dashboard/phoneOperators/edit/${row.id}`} className="dropdown-item">
                      <i className="fas fa-edit"></i> Edit
                    </Link>
                  </MDBDropdownItem>
                  <MDBDropdownItem onClick={() => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "You won't be able to revert this!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                      cancelButtonText: "No, cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios.put(`https://localhost:7248/api/Book/${row.id}`)
                          .then(() => {
                            toast.success("Booked deleted successfully");
                            window.location.reload();
                          })
                          .catch((err) => {
                            toast.error(err.response.data.message);
                          });
                      }
                    });
                  }}>
                    <i className="fas fa-trash"></i> Delete
                  </MDBDropdownItem>
                  <MDBDropdownItem onClick={() => {
                    row.status === "active" ? 
                    Swal.fire({
                      title: "Are you sure?",
                      text: "Are you sure you want to delete this book?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, delete it!",
                      cancelButtonText: "No, cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios.put(`http://localhost:3000/api/v1/phone-operator/update-status/${row.id}`, { status: "blocked" })
                          .then(() => {
                            toast.success("Phone Operator blocked successfully");
                            window.location.reload();
                          })
                          .catch((err) => {
                            toast.error(err.response.data.message);
                          });
                      }
                    }) : 
                    Swal.fire({
                      title: "Are you sure?",
                      text: "Are you sure you want to unblock this phone operator?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Yes, unblock!",
                      cancelButtonText: "No, cancel!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios.put(`http://localhost:3000/api/v1/phone-operator/update-status/${row.id}`, { status: "active" })
                          .then(() => {
                            toast.success("Phone Operator unblocked successfully");
                            window.location.reload();
                          })
                          .catch((err) => {
                            toast.error(err.response.data.message);
                          });
                      }
                    });
                  }}>
                    <i className={row.status === "active" ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                    {row.status === "active" ? " Block" : " Unblock"}
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
      <div className="card shadow" style={{ marginBottom:"150px"  }}>
        <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
          <Link to="/dashboard">
            <i className="fas fa-arrow-left"></i>{" "}
          </Link>
          <h6 className="m-0 font-weight-bold text-primary">
            Book Details
          </h6>
          <Link
            to="/dashboard/phoneOperators/add"
            className="btn btn-sm btn-primary"
          >
            Add New Book
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
    </>
  );
};

export default phoneOperator;
