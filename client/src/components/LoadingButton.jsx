import Spinner from "~/assets/svg/Spinner"
const LoadingButton = () => {
    return (
        <button
            disabled
            type="button"
            className=" mt-4 w-full text-white bg-blue hover:bg-ocean focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 
            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center justify-center">
            <>
                <Spinner />
                Loading...
            </>

        </button>
    )
}

export default LoadingButton