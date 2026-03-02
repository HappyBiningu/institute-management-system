import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all students
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        family: {
          select: {
            id: true,
            name: true,
            discountAmount: true
          }
        },
        subscriptions: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                feeStructure: true
              }
            },
            service: {
              select: {
                id: true,
                name: true,
                feeStructure: true
              }
            }
          },
          where: {
            endDate: null // Active subscriptions only
          }
        },
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST - Create a new student
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, grade, dateOfBirth, familyId, enrollmentDate } = body;

    // Validate required fields
    if (!name || !familyId) {
      return NextResponse.json(
        { error: 'Student name and family are required' },
        { status: 400 }
      );
    }

    // Verify family exists
    const family = await prisma.family.findUnique({
      where: { id: familyId }
    });

    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 });
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        surname: body.surname || null,
        idNumber: body.idNumber || null,
        gender: body.gender || null,
        ethnicity: body.ethnicity || null,
        homeLanguage: body.homeLanguage || null,
        address: body.address || null,
        city: body.city || null,
        postalCode: body.postalCode || null,
        phoneNumber: body.phoneNumber || null,
        email: body.email || null,
        grade: grade || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        enrollmentDate: enrollmentDate ? new Date(enrollmentDate) : new Date(),
        familyId,
        emergencyContactName: body.emergencyContactName || null,
        emergencyContactPhone: body.emergencyContactPhone || null,
        previousSchool: body.previousSchool || null,
        medicalConditions: body.medicalConditions || null,
      },
      include: {
        family: {
          select: {
            id: true,
            name: true,
            discountAmount: true
          }
        },
        subscriptions: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                feeStructure: true
              }
            },
            service: {
              select: {
                id: true,
                name: true,
                feeStructure: true
              }
            }
          },
          where: {
            endDate: null
          }
        },
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
