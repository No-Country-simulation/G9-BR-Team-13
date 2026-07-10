import JsonViewer from "../../components/JsonViewer/JsonViewer";
import AnalysisForm from "../../components/AnalysisForm/AnalysisForm";
import ResultCard from "../../components/ResultCard/ResultCard";
import StatusCards from "../../components/StatusCards/StatusCards";

function Home() {
  return (
    <>
      <StatusCards />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AnalysisForm />
        <ResultCard />
      </section>
      <JsonViewer />
    </>
  );
}

export default Home;