const PredictionCard = ({ prediction }) => (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-sm text-slate-400">Live Prediction</p>
                <h3 className="text-xl font-semibold text-white">{prediction.category}</h3>
            </div>
            <div className="rounded-full bg-cyan-400/15 px-3 py-1 text-sm text-cyan-300">
                {prediction.confidence}% confidence
            </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
                <p className="text-sm text-slate-400">Sentiment</p>
                <p className="mt-1 text-lg font-medium text-white">{prediction.sentiment}</p>
            </div>
            <div>
                <p className="text-sm text-slate-400">Keywords</p>
                <p className="mt-1 text-lg font-medium text-white">{prediction.keywords.join(', ')}</p>
            </div>
        </div>

        <div className="mt-6">
            <p className="text-sm text-slate-400">Summary</p>
            <p className="mt-2 text-sm leading-7 text-slate-300">{prediction.summary}</p>
        </div>
    </div>
);

export default PredictionCard;
