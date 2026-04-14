import type { ScreenContext } from '../index'
import styles from '../../styles/Content.module.css'

export default function ManageUsers({ context }: { context: ScreenContext }) {
  return (
    <div className={styles.card}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Faculty</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {context.users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.faculty || 'N/A'}</td>
                <td>Active</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
