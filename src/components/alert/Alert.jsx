import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"


const Alert = ({ isAlert, alertSuccess, alertMsg }) => {
    return (
        <>
            <div className={`${isAlert ? "flex" : "hidden"} top-0 left-0 right-0 fixed justify-center text-center py-4 lg:px-4`}>
                <div className="p-3 bg-[--bg-accent] items-center leading-none rounded-lg flex gap-3 lg:inline-flex">
                    <span className={`text-xl ${alertSuccess ? "text-[--success]" : "text-[--error]"}`}> <FontAwesomeIcon icon={alertSuccess ? faCircleCheck : faCircleExclamation} /> </span>
                    <span className="flex-auto text-left text-[--text-white] font-semibold"> {alertMsg} </span>
                </div>
            </div>
        </>
    )
}

export default Alert