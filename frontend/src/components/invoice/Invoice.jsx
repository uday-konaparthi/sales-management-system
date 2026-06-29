import React, { forwardRef, useEffect } from "react";
import "./Invoice.css";
import { useSelector } from "react-redux";

const Invoice = forwardRef(
  (
    {
      sale = {},
    },
    ref
  ) => {

    const totalQty = sale?.tototalItems;
    const totalAmount = sale?.totalAmount;

    const { user } = useSelector(s => s.auth);

    //const taxableValue = sale?.totalAmount / 1.05;
    //const gst = sale?.totalAmount - taxableValue;
    
    //const sgst = gst / 2;

    const billItems = sale?.billedItems || [];

    /*useEffect(() => {
      console.log(billItems);
      console.log(shop)
      console.log(sale)
    }, [sale])*/

    return (
      <div className="invoice-container" ref={ref}>
        {/* Header */}

        <div className="invoice-header">

          {user.logo && (
            <img
              src={user.logo}
              className="shop-logo"
              alt="logo"
            />
          )}

          <h2>{user.shopName}</h2>

          <p>{user.address}</p>

          <p>{user.city}</p>

          <p>GST : {user.gst}</p>

          <p>PH : {user.phone}</p>

          <h3>TAX INVOICE</h3>

          <h4>CUSTOMER COPY</h4>

        </div>

        <hr />

        {/* Bill Details */}

        <div className="bill-info">

          <div>
            <strong>Bill No :</strong> {sale.billNo}
          </div>

          <div>
            <strong>Date :</strong>{" "}
            {new Date().toLocaleString()}
          </div>

          <div>
            <strong>Cashier :</strong> {user.username}
          </div>

          <div>
            <strong>Counter :</strong> {sale.counter}
          </div>

        </div>

        <hr />

        {/* Products */}

        <table className="invoice-table">

          <thead>

            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>

          </thead>

          <tbody>

            {billItems.map((item, index) => (

              <tr key={index}>

                <td>
                  <div>{item?.name}</div>

                  <small>
                    HSN : {item?.hsn || "-"} | GST {item?.gst || 5}%
                  </small>

                </td>

                <td>{item?.quantity}</td>

                <td>{item?.sellingPrice}</td>

                <td>
                  {(item?.quantity * item?.sellingPrice).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <hr />

        {/* Totals */}

        <div className="summary">

          <div>
            <span>Total Qty</span>

            <span>{totalQty || billItems.length}</span>
          </div>

          <div>
            <span>Gross Amount</span>

            <span>₹ {totalAmount}</span>
          </div>

          <div>
            <span>Discount</span>

            <span>₹ 0.00</span>
          </div>

          {/*<div>
            <span>Taxable Value</span>

            <span>₹ {taxableValue.toFixed(2)}</span>
          </div>

          <div>
            <span>SGST</span>

            <span>₹ {sgst.toFixed(2)}</span>
          </div>*/}

          <div className="grand-total">

            <span>GRAND TOTAL</span>

            <span>₹ {totalAmount}</span>

          </div>

        </div>

        <hr />

        {/* Payment */}

        <div className="payment">

          <strong>Payment :</strong> {sale?.paymentType}

        </div>

        <hr />

        {/* Terms */}

        <div className="terms">

          <strong>Terms & Conditions</strong>

          <ul>

            <li>Goods once sold cannot be returned.</li>

            <li>Exchange within 7 days.</li>

            <li>Price includes GST.</li>

            <li>Thank you for shopping.</li>

          </ul>

        </div>

        <hr />

        <div className="footer">

          <h3>THANK YOU</h3>

          <p>VISIT AGAIN</p>

        </div>

      </div>
    );
  }
);

export default Invoice;