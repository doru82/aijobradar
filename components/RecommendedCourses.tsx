"use client";

import { Course } from "@/lib/courses";
import { ExternalLink, Star, Users, BookOpen } from "lucide-react";

interface RecommendedCoursesProps {
  courses: Course[];
  isPremium: boolean;
}

export default function RecommendedCourses({ courses, isPremium }: RecommendedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <div
      className={`rounded-2xl p-6 ${
        isPremium
          ? "bg-white border-2 border-emerald-200"
          : "bg-slate-800/50 border border-slate-700"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${
            isPremium ? "bg-emerald-100" : "bg-emerald-500/10"
          }`}
        >
          <BookOpen
            className={`w-5 h-5 ${
              isPremium ? "text-emerald-600" : "text-emerald-400"
            }`}
          />
        </div>
        <div>
          <h3
            className={`font-semibold ${
              isPremium ? "text-gray-900" : "text-white"
            }`}
          >
            Recommended Courses
          </h3>
          <p
            className={`text-sm ${
              isPremium ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Boost your skills, reduce your risk
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          
           <a key={course.id}
            href={course.affiliateUrl}

            target="_blank"
            rel="noopener noreferrer"
            className={`block p-4 rounded-xl transition-all ${
              isPremium
                ? "bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                : "bg-slate-700/50 hover:bg-slate-700 border border-slate-600"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium text-sm mb-1 ${
                    isPremium ? "text-gray-900" : "text-white"
                  }`}
                >
                  {course.title}
                </h4>
                <p
                  className={`text-xs mb-2 line-clamp-2 ${
                    isPremium ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {course.description}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={`flex items-center gap-1 ${
                      isPremium ? "text-yellow-600" : "text-yellow-400"
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {course.rating}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      isPremium ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    {course.students}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isPremium
                        ? "bg-emerald-200 text-emerald-700"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>
              </div>
              <ExternalLink
                className={`w-4 h-4 flex-shrink-0 ${
                  isPremium ? "text-emerald-500" : "text-emerald-400"
                }`}
              />
            </div>
          </a>
        ))}
      </div>

      <p
        className={`text-xs mt-4 text-center ${
          isPremium ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Affiliate links - we may earn a commission
      </p>
    </div>
  );
}