import Link from "next/link";

const LocalList = ({locals}) => {
    return (
        <ul>
            {locals.map(local =>(
                <li key={local._id}>
                    <Link href={`/locals/${local._id}`}>{local.name}</Link>
                </li>
            ))}
        </ul>
    )
}
export default LocalList;