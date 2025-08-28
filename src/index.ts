import { opentelemetry } from "@elysiajs/opentelemetry";
import { context, SpanStatusCode, trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Elysia, t } from "elysia";

const tracer = trace.getTracer("span-tester", "1.0.0");

new Elysia()
	.use(
		opentelemetry({
			serviceName: process.env.OTEL_SERVICE_NAME || "span-tester",
			spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
		}),
	)
	.get("/", () => "OpenTelemetry Span Tester")
	.all(
		"/:level",
		({ query, params: { level }, status }) => {
			// 独自のスパンを作成
			const span = tracer.startSpan(`${level}-operation`);
			const ctx = trace.setSpan(context.active(), span);

			return context.with(ctx, () => {
				try {
					// メッセージをspanイベントとして記録
					switch (level) {
						case "debug":
							span.addEvent("debug", {
								message: query.body,
								level: "debug",
							});
							span.setStatus({ code: SpanStatusCode.OK });
							span.setAttribute("level", "debug");
							span.setAttribute("message", query.body);
							return status(204);
						case "info":
							span.addEvent("info", {
								message: query.body,
								level: "info",
							});
							span.setStatus({ code: SpanStatusCode.OK });
							span.setAttribute("level", "info");
							span.setAttribute("message", query.body);
							return status(204);
						case "warn":
							span.addEvent("warning", {
								message: query.body,
								level: "warn",
							});
							span.setStatus({ code: SpanStatusCode.OK });
							span.setAttribute("level", "warn");
							span.setAttribute("message", query.body);
							return status(204);
						case "error":
							span.addEvent("error", {
								message: query.body,
								level: "error",
							});
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: query.body,
							});
							span.setAttribute("level", "error");
							span.setAttribute("message", query.body);
							span.setAttribute("error", true);
							span.recordException(new Error(query.body));
							return status(500);
						default:
							return status(400);
					}
				} finally {
					span.end();
				}
			});
		},
		{
			query: t.Object({
				body: t.String(),
			}),
			params: t.Object({
				level: t.Enum({
					debug: "debug",
					info: "info",
					warn: "warn",
					error: "error",
				}),
			}),
		},
	)
	.listen(3000, ({ hostname, port }) => {
		console.log(`🦊 Elysia is running at ${hostname}:${port}`);
	});
