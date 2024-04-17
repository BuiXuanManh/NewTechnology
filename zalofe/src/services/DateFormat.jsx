export default function DateFormat(dateString) {
    const date = new Date(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm số 0 phía trước nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm số 0 phía trước nếu cần
    const year = date.getFullYear(); // Lấy năm
    // Trả về chuỗi ngày tháng đã định dạng
    return `${day}-${month}-${year}`;
}