import Head from "next/head"

const Meta = ({ title }: { title: string }) => {
    return (
        <Head>
            <title>{title}</title>
        </Head>
    )
}

export default Meta