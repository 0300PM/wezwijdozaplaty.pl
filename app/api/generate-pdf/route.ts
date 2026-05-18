import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const { htmlContent } = await req.json();

        if (!htmlContent) {
            return NextResponse.json(
                { error: 'Brak htmlContent' },
                { status: 400 }
            );
        }

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        await page.setContent(`
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 40px;
                            color: #000;
                        }

                        * {
                            box-sizing: border-box;
                        }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
            </html>
        `);

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px',
            },
        });

        await browser.close();

        return new NextResponse(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition':
                    'attachment; filename="wezwanie-do-zaplaty.pdf"',
            },
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: 'Błąd generowania PDF' },
            { status: 500 }
        );
    }
}