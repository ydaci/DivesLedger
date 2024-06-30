import AddDive from "@/components/shared/AddDive";
import AddCertification from "@/components/shared/AddCertification";
import GetDives from "@/components/shared/GetDives";
import Events from "@/components/shared/Events";

const Main = () => {
    return (
        <nav>
            <div>
                 <h3 className="font-bold">Plongées</h3>
                 <AddDive />
            </div>
            <div>
                 <h3 className="font-bold">Certifications</h3>
                 <AddCertification />
            </div>
            <div>
                 <h3 className="font-bold">Dives</h3>
                 <GetDives />
            </div>
            <div>
                 <h3 className="font-bold">Events</h3>
                 <Events />
            </div>
        </nav>

    )
}

export default Main;