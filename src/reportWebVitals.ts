import { MetricType } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: MetricType) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals')
            .then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
                onCLS(onPerfEntry);
                onINP(onPerfEntry);
                onFCP(onPerfEntry);
                onLCP(onPerfEntry);
                onTTFB(onPerfEntry);
            })
            .catch((exception) => {
                //TODO log to sentry
                console.error(exception);
            });
    }
};

export { reportWebVitals };
