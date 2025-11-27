import RiderSidebar from "@/app/components/RiderSidebar";
import styles from "./layout.module.css";

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.riderLayout}>
      <RiderSidebar />
      <main className={styles.pageContent}>{children}</main>
    </div>
  );
}
