import Spinner from "~/assets/svg/Spinner"
const LoadingButton = ({isSubmitting}) => {
    return (
        <button
            disabled
            type="button"
            className={`mt-4 w-full text-white bg-blue hover:bg-ocean font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 inline-flex items-center justify-center ${isSubmitting ? "hover:bg-disable bg-disable" : ""}`}>
            <>
                <Spinner />
                Loading
            </>

        </button>
    )
}

export default LoadingButton