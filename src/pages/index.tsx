import MainLayout from "@/layouts/main-layout"

const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque fuga molestias ducimus harum? Laboriosam quibusdam quae ullam, expedita, ut sint, doloremque omnis nesciunt doloribus error deserunt animi? Iusto, perferendis optio.</p>
        </>
    )
}

Dashboard.layout = (page: React.ReactElement) => {
    return (
        <MainLayout title="Dashboard">{page}</MainLayout>
    )
}

export default Dashboard