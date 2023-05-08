import { Link } from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";


function SidebarOrder({  onWaitClick }) {
    const { id_user, username } = useSelector ((state) => {
        return {
          id_user: state.userReducer.id_user,
          username: state.userReducer.username,
        };
      })
  return (
    <div className="container">
      <div className="border border-top-0 border-start-0 border-end-0 border-primary">
        <div className="">
          <CgProfile />
        </div>
        <div className="">{username}</div>
      </div>
      <div className="mx-2 mt-2">
        <div className="accordion mt-16px">
          <div className="accordion-item">
            <h4 className="accordion-header">
              <button
                className="accordion-button"
                style={{
                  backgroundColor: "#f96c08",
                  color: "white",
                  borderColor: "#FFA500",
                }}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <strong>Pembelian</strong>
              </button>
            </h4>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div
                className="accordion-body"
                style={{
                  backgroundColor: "#FFE5B4",
                  color: "orange",
                  borderColor: "#FFA500",
                }}
              >
                <Link href="/transaction/">
                  <div className="">
                    <strong>Daftar Transaksi</strong>
                  </div>
                </Link>
                <div className="" onClick={onWaitClick}>
                  <strong>Menunggu pembayaran</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 mx-2">
        <div className="accordion mt-16px">
          <div className="accordion-item">
            <h4 className="accordion-header">
              <button
                className="accordion-button"
                style={{
                    backgroundColor: "#f96c08",
                    color: "white",
                    borderColor: "#FFA500",
                  }}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <strong>Profile</strong>
              </button>
            </h4>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse show"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div
                className="accordion-body"
                style={{
                    backgroundColor: "#FFE5B4",
                    color: "orange",
                    borderColor: "#FFA500",
                  }}
              >
                <Link href="/profile/">
                  <div className="">Halaman Profile</div>
                </Link>
                <Link href="/wishlist/">
                  <div className="">Wishlist</div>
                </Link>
                <Link href="/cart/">
                  <div className="">Keranjang Belanja</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarOrder;
