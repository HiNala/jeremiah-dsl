import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, consent, utm_source, utm_medium, utm_campaign } = body;

    // Basic validation
    if (!email || !consent) {
      return NextResponse.json(
        { error: 'Email and consent are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically integrate with your email service provider
    // For now, we'll just log the subscription and return success
    console.log('New subscription:', {
      email,
      consent,
      utm_source,
      utm_medium,
      utm_campaign,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with email service provider (e.g., Mailchimp, ConvertKit, etc.)
    // Example:
    // await emailService.subscribe({
    //   email,
    //   source: utm_source,
    //   medium: utm_medium,
    //   campaign: utm_campaign,
    // });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
