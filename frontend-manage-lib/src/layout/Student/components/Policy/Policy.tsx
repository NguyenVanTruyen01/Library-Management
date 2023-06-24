import styles from './styles/policy.module.scss'
const Policy = () => {
  return (
    <div className={styles.policy}>
      <div className={styles.policyMain}>
        <div className={styles.title}>Thư Viện Online <i className="fa-sharp fa-solid fa-book-open"/></div>
        <div className={styles.mucluc}>Các chính sách và nội quy của thư viện.</div>
        <div className={styles.content}>
               <p className={styles.titlePolicy}> 1. Mượn sách đọc tại thư viện:</p>
               <p className={styles.contentPolicy}>- Bạn đọc có thể đọc sách trong phòng báo, tạp chí mà không cần đăng ký mượn sách. Đọc xong bạn đọc để sách tại chỗ hoặc tập trung lại một chỗ để thủ thư cất. Nếu bạn đọc mang sách trong kho ra phòng đọc chính, phải đăng ký tại quầy Thủ thư.</p>
               <p className={styles.contentPolicy}>- Bạn đọc có thể đọc các nhật báo, tuần báo, tạp chí, tập san tại chỗ không cần đăng ký mượn. Bạn đọc không được mượn báo chí mang về nhà. Báo chí đọc xong để tại chỗ.</p>
               <p className={styles.contentPolicy}>-  Tất cả các luận văn đều phục vụ đọc tại chỗ. Bạn đọc có thể tra cứu danh mục luận văn trên máy tính hoặc xem danh mục được in sẵn tại quầy Thủ thư. Bạn đọc chỉ có thể photo luận văn cử nhân.</p>   </div>
        <div className={styles.content}>
               <p className={styles.titlePolicy}>  2. Mượn sách đi photo:</p>
               <p className={styles.contentPolicy}>- Bạn đọc phải xuất trình thẻ sinh viên để làm thủ tục mang sách đi photo.</p>
               <p className={styles.contentPolicy}>- Phải thế chân thấp nhất là 100.000đ/ 1 quyển.</p>
               <p className={styles.contentPolicy}>- Trả lại thế chân khi sinh viên trả sách.</p>
               <p className={styles.contentPolicy}>- Thời hạn mượn sách là trong ngày, nếu sinh viên mang sách về sẽ bi xử lý theo qui định của thư viện</p>
        </div>
        <div className={styles.content}>
               <p className={styles.titlePolicy}>   3. Mượn sách về đọc:</p>
               <p className={styles.contentPolicy}>- Bạn đọc phải xuất trình thẻ sinh viên để làm thủ tục mượn sách về đọc.</p>
               <p className={styles.contentPolicy}>- Chỉ phục vụ mượn về đối với tài liệu có trên 5 bản.</p>
               <p className={styles.contentPolicy}>- Phải thế chân thấp nhất là 100.000đ/ 1 quyển.</p>
               <p className={styles.contentPolicy}>- Trả lại thế chân khi sinh viên trả sách.</p>
               <p className={styles.contentPolicy}>- Thời hạn mượn sách là 2 tuần.</p>
               <p className={styles.contentPolicy}>- Bạn đọc phải đến Thư viện gia hạn sách khi hết hạn mượn sách.</p>
               <p className={styles.contentPolicy}>- Ghi vào sổ mượn sách về nhà.Ghi vào sổ mượn sách về nhà.</p>
        </div>
      </div>
     
      Policy
    </div>
  )
}

export default Policy