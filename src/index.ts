import { opentelemetry } from "@elysiajs/opentelemetry";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Elysia, t } from "elysia";

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
		}),
	)
	.get("/", () => "OpenTelemetry Span Tester")
	.all(
		"/:level",
		({ query, params: { level }, status }) => {
			const span = trace.getActiveSpan();

			if (span) {
				// メッセージをspanイベントとして記録
				switch (level) {
					case "debug":
						span.addEvent("debug", {
							message: query.body,
							level: "debug",
						});
						span.setStatus({ code: SpanStatusCode.OK });
						return status(204);
					case "info":
						span.addEvent("info", {
							message: query.body,
							level: "info",
						});
						span.setStatus({ code: SpanStatusCode.OK });
						return status(204);
					case "warn":
						span.addEvent("warning", {
							message: query.body,
							level: "warn",
						});
						span.setStatus({ code: SpanStatusCode.OK });
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
						span.recordException(new Error(query.body));
						return status(500);
				}
			}

			// spanが取得できない場合のフォールバック
			return status(level === "error" ? 500 : 204);
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
