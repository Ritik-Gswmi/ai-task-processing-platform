import Layout from "../components/Layout";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  return (
    <Layout>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Create Tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Use the form below to submit a new AI job.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            After creating a task, check <span className="font-medium text-slate-700">Current Tasks</span> or <span className="font-medium text-slate-700">All Tasks</span> from the sidebar.
          </p>
        </div>

        <TaskForm />
      </section>
    </Layout>
  );
}

export default Dashboard;
