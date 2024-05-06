import { Link } from "react-router-dom"

const ErrorPage = () => {

    return (
        <>
            <div className="h-[100vh] w-full flex justify-center items-center">

                <div className="text-center">

                    <h1 className="mb-12 text-8xl font-semibold text-[--gray]"> Oops! </h1>
                    <h2 className="mb-3 text-3xl font-semibold text-[--gray-accent]"> 404 - Page Not Found </h2>

                    <p className="mb-6 text-[--gray]">Sorry, an unexpected error has occurred.</p>

                    <Link to="/"> <span className="text-[--secondary-color]"> Go to home </span> </Link>

                </div>
            </div>
        </>
    )
}

export default ErrorPage