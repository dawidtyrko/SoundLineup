import Link from "next/link";

const GroupList = ({ groups }) => {
    return (
        <ul>
            {groups.map(group => (
                <li key={group._id}>
                    <Link href={`/groups/${group._id}`}>{group.name}</Link>
                </li>
            ))}
        </ul>
    )
}
export default GroupList;