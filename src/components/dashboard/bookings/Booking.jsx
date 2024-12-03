import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MDBDataTableV5,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBBtn
} from "mdbreact";

const Booking = () => {
  const [datatable, setDatatable] = useState({
    columns: [
      { label: "ID", field: "id" },
      {
        label: "Book Image",
        field: "book_image",
        width: 100,
      },
      {
        label: "Book Title",
        field: "book_title",
      },
      {
        label: "Book Price",
        field: "book_price",
      },
      {
        label: "Ordered Quantity",
        field: "order_quantity",
      },
      {
        label: "Total Amount",
        field: "total_amount",
      },
      {
        label: "Customer Name",
        field: "customer_name",
      },
      {
        label: "Status",
        field: "status",
      },
      {
        label: "Actions",
        field: "actions",
      }
    ],
    rows: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const toggleModal = () => setModal(!modal);

  const fetchData = () => {
    setIsLoading(true);
    axios.get("https://localhost:7248/api/Order")
      .then((response) => {
        const data = response.data.$values;
        console.log(data);
        if (!data || data.length === 0) {
          toast.info("No Orders found.");
          setIsLoading(false);
          return;
        }

        const rows = data.map((booking) => ({
          id: `ORD-${new Date().getFullYear()}-${booking.id}`,
          book_image: (
            <img
              src={booking.book.image}
              alt={booking.book.title}
              style={{ width: "25px", height: "25px", borderRadius: "50%" }}
            />
          ),
          book_title: booking.book.title,
          book_price: `$${booking.book.price}`,
          order_quantity: booking.quantity,
          total_amount: booking.totalPrice,
          customer_name: booking.customer.name,
          status: booking.status,
          actions: (
            <MDBDropdown>
              <MDBDropdownToggle caret style={{ backgroundColor: 'transparent', border: 'none', color: '#000' }} className="btn btn-sm btn-secondary">
                <i className="fas fa-ellipsis-v"></i>
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem onClick={() => {
                  setSelectedBooking(booking);
                  toggleModal();
                }}>
                  <i className="fas fa-eye me-2"></i> View Details
                </MDBDropdownItem>
                <MDBDropdownItem onClick={() => {
                  setSelectedBooking(booking);
                  toggleModal();
                }}>
                  <i className="fas fa-cart-shopping me-2"></i> Update Order Status
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          ),
        }));

        setDatatable((prevState) => ({ ...prevState, rows: rows }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        toast.error(err.response?.data?.message || "Failed to load bookings. Please try again later.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="card shadow" style={{ marginBottom: "250px" }}>
        <div className="card-header py-3 d-sm-flex align-items-center justify-content-between">
          <Link to="/dashboard">
            <i className="fas fa-arrow-left"></i>{" "}
          </Link>
          <h6 className="m-0 font-weight-bold text-primary">All Orders</h6>
          <div>{""}</div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            {isLoading ? (
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

      {/* Modal for Booking Details */}
      <MDBModal isOpen={modal} toggle={toggleModal}>
        <MDBModalHeader toggle={toggleModal}>Book Details</MDBModalHeader>
        <MDBModalBody>
          {selectedBooking && (
            <div>
              <p style={{ fontSize: '24px' }}>
                <strong>Order ID:</strong> {`ORD-${new Date().getFullYear()}-${selectedBooking.id}`},
              </p>
              <p><strong>Book Title:</strong> {selectedBooking.book.title}</p>
              <p><strong>Ordered Quantity:</strong> {selectedBooking.quantity}</p>
              <p><strong>Total Amount: $</strong> {selectedBooking.totalPrice}</p>
              <p><strong>Customer Name:</strong> {selectedBooking.customer.name}</p>
              <p><strong>Customer Address:</strong> {selectedBooking.customer.address}</p>
              <p><strong>Customer Mobile:</strong> {selectedBooking.customer.mobileNumber}</p>
              <p><strong>Status:</strong> <span className={`badge badge-${selectedBooking.status === "Pending" ? "danger" : "success"}`}>
                {selectedBooking.status}
              </span></p>
              <p><strong>Created At:</strong> {new Date(selectedBooking.createAt).toLocaleString()}</p>

            </div>
          )}
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={toggleModal}>Close</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </>
  );
};

export default Booking;
