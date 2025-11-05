import React from "react";
import "./PolicyPage.css";

export const PolicyPage = () => {
  return (
    <div className="policyContainer">
      <h1 className="policyTitle">Chính sách và Điều khoản Dịch vụ</h1>

      <section className="policySection">
        <h2 className="sectionTitle">1. Chính sách Bảo mật</h2>
        <p className="sectionText">
          Nhà hàng Tomato cam kết bảo vệ thông tin cá nhân của Quý khách. Chúng
          tôi thu thập thông tin để xử lý đơn hàng, cải thiện dịch vụ và cung
          cấp trải nghiệm tốt nhất.
        </p>
        <h3 className="subSectionTitle">1.1. Thông tin thu thập</h3>
        <p className="sectionText">Chúng tôi thu thập các thông tin sau:</p>
        <ul className="policyList">
          <li>
            Thông tin cá nhân: Tên, địa chỉ giao hàng, số điện thoại, email.
          </li>
          <li>
            Thông tin đơn hàng: Lịch sử đặt hàng, món ăn yêu thích, phương thức
            thanh toán.
          </li>
          <li>
            Thông tin kỹ thuật: Địa chỉ IP, loại trình duyệt, thời gian truy cập
            (không liên kết với thông tin cá nhân).
          </li>
        </ul>
        <h3 className="subSectionTitle">1.2. Mục đích sử dụng thông tin</h3>
        <p className="sectionText">Thông tin được sử dụng cho các mục đích:</p>
        <ul className="policyList">
          <li>Xử lý và giao nhận đơn hàng.</li>
          <li>Quản lý tài khoản tích điểm và ưu đãi.</li>
          <li>Cải thiện chất lượng dịch vụ và sản phẩm.</li>
          <li>Hỗ trợ khách hàng và giải quyết khiếu nại.</li>
        </ul>
        <h3 className="subSectionTitle">1.3. Bảo mật thông tin</h3>
        <p className="sectionText">
          Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông
          tin cá nhân của Quý khách khỏi việc truy cập, sử dụng hoặc tiết lộ
          trái phép. Thông tin thanh toán (qua Stripe) được xử lý bởi bên thứ ba
          uy tín và không được lưu trữ trực tiếp trên hệ thống của chúng tôi.
        </p>
        <h3 className="subSectionTitle">1.4. Chia sẻ thông tin</h3>
        <p className="sectionText">
          Chúng tôi không bán, cho thuê hay trao đổi thông tin cá nhân của Quý
          khách với bên thứ ba, ngoại trừ:
        </p>
        <ul className="policyList">
          <li>
            Các đối tác giao hàng (chỉ thông tin cần thiết để hoàn thành đơn
            hàng).
          </li>
          <li>Khi có yêu cầu hợp pháp từ cơ quan nhà nước.</li>
        </ul>
      </section>

      <section className="policySection">
        <h2 className="sectionTitle">2. Điều khoản Dịch vụ</h2>
        <p className="sectionText">
          Bằng việc sử dụng dịch vụ của Nhà hàng Tomato, Quý khách đồng ý với
          các điều khoản dưới đây.
        </p>
        <h3 className="subSectionTitle">2.1. Đặt hàng và Thanh toán</h3>
        <ul className="policyList">
          <li>
            Quý khách có thể đặt món trực tuyến qua website của chúng tôi.
          </li>
          <li>Giá các món ăn được niêm yết rõ ràng trên website.</li>
          <li>Phí giao hàng là 30.000đ cho mỗi đơn hàng.</li>
          <li>
            Chúng tôi chấp nhận thanh toán qua Stripe. Đơn hàng sẽ được xác nhận
            sau khi thanh toán thành công.
          </li>
          <li>
            Nhà hàng có quyền từ chối hoặc hủy đơn hàng nếu phát hiện gian lận
            hoặc không thể thực hiện.
          </li>
        </ul>
        <h3 className="subSectionTitle">2.2. Chính sách Tích điểm</h3>
        <ul className="policyList">
          <li>
            Với mỗi 100.000đ chi tiêu, Quý khách sẽ tích lũy được 10 điểm.
          </li>
          <li>
            Điểm tích lũy có thể được sử dụng để đổi lấy các ưu đãi hoặc giảm
            giá theo chương trình của Nhà hàng Tomato.
          </li>
          <li>Điểm không có giá trị quy đổi thành tiền mặt.</li>
          <li>
            Chính sách tích điểm có thể thay đổi theo thời gian và sẽ được thông
            báo trước.
          </li>
        </ul>
        <h3 className="subSectionTitle">2.3. Trách nhiệm của Khách hàng</h3>
        <ul className="policyList">
          <li>Cung cấp thông tin chính xác khi đặt hàng.</li>
          <li>Bảo mật thông tin tài khoản của mình.</li>
          <li>Không sử dụng dịch vụ vào các mục đích bất hợp pháp.</li>
        </ul>
      </section>

      <section className="policySection">
        <h2 className="sectionTitle">3. Liên hệ</h2>
        <p className="sectionText">
          Nếu Quý khách có bất kỳ câu hỏi nào về chính sách này, vui lòng liên
          hệ với chúng tôi tại:
        </p>
        <p className="sectionText">
          Email:{" "}
          <a href="mailto:support@tomato.com" className="contactLink">
            support@tomato.com
          </a>
        </p>
        <p className="sectionText">
          Điện thoại: <span className="contactLink">1900 1234</span>
        </p>
        <p className="sectionText">
          Website:{" "}
          <a
            href="https://www.tomato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contactLink"
          >
            https://www.tomato.com
          </a>
        </p>
      </section>

      <p className="lastUpdated">
        Chính sách được cập nhật lần cuối: 05 tháng 11 năm 2025
      </p>
    </div>
  );
};
