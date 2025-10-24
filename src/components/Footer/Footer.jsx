import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
export const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever
          </p>
          <div className="footer-social-icons">
            <a href="/">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="/">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="/">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/delivery">Delivery</a>
            </li>
            <li>
              <a href="/privacy">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>Email: info@example.com</li>
            <li>Phone: +123456789</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2025 © All rights reserved | This template is made with
      </p>
    </div>
  );
};
