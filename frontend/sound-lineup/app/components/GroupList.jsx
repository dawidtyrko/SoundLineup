import Link from "next/link";
import classes from "./ArtistList.module.css"
import Image from "next/image";
const GroupList = ({ groups }) => {
    return (
        <ul className={classes.artistList}>
            {groups.map(group => (
                <li key={group._id} className={classes.artistListLi}>
                    <div className={classes.artistDetails}>
                        {group.profileImage && (
                            <Image src={`http://localhost:3001/${group.profileImage}`} alt={group.name} className={classes.artistImage}
                                   width={50} height={50}/>
                        )}
                        <Link href={`/groups/${group._id}`}>{group.name}</Link>
                    </div>

                </li>
            ))}
        </ul>
    )
}
export default GroupList;