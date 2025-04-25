import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
    userName = "",
    type = "monthly-report",
    data = {},
}) {
    if (type === "monthly-report") {
        console.log(data)
        return (
            <Html>
                <Head />
                <Preview>Your Monthly Financial Report</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Monthly Financial Report</Heading>
                        <Text style={styles.text}>Hello {userName},</Text>
                        <Text style={styles.text}>
                            Here&rsquo;s your financial summary for {data?.month}:
                        </Text>

                        {/* Main Stats */}
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Income</Text>
                                <Text style={styles.heading}>₹ {data?.stats.totalSell.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Total Expenses</Text>
                                <Text style={styles.heading}>₹ {data?.stats.totalBuy.toFixed(2)}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Net </Text>
                                <Text style={styles.heading}>₹ {(data?.stats.totalSell - data?.stats.totalBuy).toFixed(2)}</Text>
                            </div>
                        </Section>

                        {/* Asset Name Breakdown */}
                        {data?.stats.byAssetName && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>By Asset Name</Heading>
                                {Object.entries(data?.stats.byAssetName).map(
                                    ([assetName, totalAmount]) => {
                                        return (
                                            <div key={assetName}>
                                                <Text style={styles.text}>{assetName}</Text>
                                                <Text style={styles.text}>₹ {totalAmount.toFixed(2)}</Text>
                                            </div>
                                        );
                                    }
                                )}
                            </Section>
                        )}

                        {/* AI Insights */}
                        {data?.insights && (
                            <Section style={styles.section}>
                                <Heading style={styles.heading}>AI Insights</Heading>
                                {data.insights.map((insight, index) => (
                                    <Text key={index} style={styles.text}>
                                        • {insight}
                                    </Text>
                                ))}
                            </Section>
                        )}

                        <Text>Thankyou !</Text>
                    </Container>
                </Body>
            </Html>
        );
    }
    if (type === "budget-alert") {
        return (
            <Html>
                <Head />
                <Preview>Budget Alert</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Heading style={styles.title}>Investment Alert</Heading>
                        <Text style={styles.text}>Hello {userName},</Text>
                        <Text style={styles.text}>
                            You&rsquo;ve invested {data?.percentageUsed.toFixed(1)} % of your monthly target.
                        </Text>
                        <Section style={styles.statsContainer}>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Target Investment Amount</Text>
                                <Text style={styles.heading}>₹ {data?.budgetAmount}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Invested So Far</Text>
                                <Text style={styles.heading}>₹ {data?.totalExpenses}</Text>
                            </div>
                            <div style={styles.stat}>
                                <Text style={styles.text}>Remaining Investments</Text>
                                <Text style={styles.heading}>₹ {data?.budgetAmount - data?.totalExpenses}</Text>
                            </div>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }
}

const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: "-apple-system, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    title: {
        color: "#1f2937",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center",
        margin: "0 0 16px",
    },
    heading: {
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    statsContainer: {
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
    },
    stat: {
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    },
    section: {
        marginTop: "32px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
        border: "1px solid #e5e7eb",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px",
        borderBottom: "1 px solid #e5e7eb",
    },
};