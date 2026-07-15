import React from 'react'
import './AnalysisCard.css'

function AnalysisCard({ title, subtitle, stats, buttonText, onButtonClick }) {
  return (
    <div className="analysis-card">
      <div className="analysis-card__header">
        <div>
          <h2 className="analysis-card__title">{title}</h2>
          {subtitle && <p className="analysis-card__subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="analysis-card__body">
        {stats?.map((item, index) => (
          <div key={index} className="analysis-card__stat">
            <span className="analysis-card__stat-label">{item.label}</span>
            <span className="analysis-card__stat-value">{item.value}</span>
          </div>
        ))}
      </div>

      {buttonText && (
        <div className="analysis-card__footer">
          <button
            type="button"
            className="analysis-card__button"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  )
}

AnalysisCard.defaultProps = {
  title: 'Análise',
  subtitle: 'Resumo rápido',
  stats: [
    { label: 'Total', value: '123' },
    { label: 'Média', value: '45%' },
  ],
  buttonText: 'Ver mais',
  onButtonClick: () => {},
}

export default AnalysisCard
