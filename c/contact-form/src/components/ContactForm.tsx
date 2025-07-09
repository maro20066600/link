'use client';

import { useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, push } from 'firebase/database';

// تعريف اللجان المتاحة
const COMMITTEES = [
    'Public Relations (PR) - العلاقات العامة',
    'Human Resources (HR) - الموارد البشرية',
    'Operations (OR) - العمليات',
    'Social Media (SM) - وسائل التواصل الاجتماعي'
];

// تعريف المحافظات
const GOVERNORATES = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'البحيرة', 'كفر الشيخ', 'الدقهلية',
    'الغربية', 'المنوفية', 'القليوبية', 'الشرقية', 'بورسعيد', 'الإسماعيلية',
    'السويس', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر', 'الفيوم',
    'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
    'الوادي الجديد', 'مطروح'
];

export default function ContactForm() {
    const [status, setStatus] = useState<{
        type: 'success' | 'error' | 'info' | null;
        message: string;
    }>({ type: null, message: '' });

    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        college: '',
        university: '',
        year: '',
        governorate: '',
        committee: '',
        volunteerHistory: '',
        hasVolunteered: 'لا',
        acceptTerms: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (!formData.acceptTerms) {
                throw new Error('يجب الموافقة على الشروط والأحكام للمتابعة');
            }

            setStatus({ type: 'info', message: 'جاري إرسال البيانات...' });

            // التحقق من صحة رقم الموبايل
            const mobileRegex = /^01[0125][0-9]{8}$/;
            if (!mobileRegex.test(formData.mobile)) {
                throw new Error('رقم الموبايل غير صحيح');
            }

            // التحقق من صحة البريد الإلكتروني
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('البريد الإلكتروني غير صحيح');
            }

            const data = {
                ...formData,
                timestamp: new Date().toISOString()
            };

            // حفظ في Firebase
            const submissionsRef = ref(database, 'submissions');
            await push(submissionsRef, data);

            setStatus({ type: 'success', message: 'تم إرسال البيانات بنجاح!' });
            setFormData({
                fullName: '',
                mobile: '',
                email: '',
                college: '',
                university: '',
                year: '',
                governorate: '',
                committee: '',
                volunteerHistory: '',
                hasVolunteered: 'لا',
                acceptTerms: false
            });

        } catch (error: any) {
            console.error('Error:', error);
            setStatus({ 
                type: 'error', 
                message: error.message || 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.'
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">استمارة التسجيل</h2>
                
                {/* البيانات الشخصية */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">البيانات الشخصية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fullName" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                الاسم رباعي:
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                placeholder="الاسم رباعي باللغة العربية"
                            />
                        </div>

                        <div>
                            <label htmlFor="mobile" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                رقم الموبايل:
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                placeholder="01xxxxxxxxx"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                البريد الإلكتروني:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label htmlFor="governorate" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                المحافظة:
                            </label>
                            <select
                                id="governorate"
                                name="governorate"
                                value={formData.governorate}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            >
                                <option value="">اختر المحافظة</option>
                                {GOVERNORATES.map(gov => (
                                    <option key={gov} value={gov}>{gov}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* البيانات الدراسية */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">البيانات الدراسية</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="college" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                الكلية:
                            </label>
                            <input
                                type="text"
                                id="college"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="university" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                الجامعة:
                            </label>
                            <input
                                type="text"
                                id="university"
                                name="university"
                                value={formData.university}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                السنة الدراسية:
                            </label>
                            <input
                                type="text"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* معلومات التطوع */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">معلومات التطوع</h3>
                    
                    <div>
                        <label className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                            اختر اللجنة المفضلة:
                        </label>
                        <select
                            name="committee"
                            value={formData.committee}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        >
                            <option value="">اختر اللجنة</option>
                            {COMMITTEES.map(committee => (
                                <option key={committee} value={committee}>{committee}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                            هل سبق لك التطوع مع وزارة الشباب والرياضة؟
                        </label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="hasVolunteered"
                                    value="نعم"
                                    checked={formData.hasVolunteered === 'نعم'}
                                    onChange={handleChange}
                                    className="ml-2"
                                />
                                <span className="text-gray-700 dark:text-gray-200">نعم</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="hasVolunteered"
                                    value="لا"
                                    checked={formData.hasVolunteered === 'لا'}
                                    onChange={handleChange}
                                    className="ml-2"
                                />
                                <span className="text-gray-700 dark:text-gray-200">لا</span>
                            </label>
                        </div>
                    </div>

                    {formData.hasVolunteered === 'نعم' && (
                        <div>
                            <label htmlFor="volunteerHistory" className="block text-right mb-1 font-medium text-gray-700 dark:text-gray-200">
                                تفاصيل الأنشطة التطوعية السابقة:
                            </label>
                            <textarea
                                id="volunteerHistory"
                                name="volunteerHistory"
                                value={formData.volunteerHistory}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                rows={4}
                                placeholder="يرجى ذكر تفاصيل الأنشطة التطوعية السابقة مع وزارة الشباب والرياضة"
                            />
                        </div>
                    )}
                </div>

                {/* الشروط والأحكام */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">الشروط والأحكام</h3>
                    
                    <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 text-sm">
                        <p>بالتسجيل في هذا النموذج، أنت توافق على ما يلي:</p>
                        <ul className="list-disc mr-6 mt-2 space-y-2">
                            <li>السماح لوزارة الشباب والرياضة باستخدام بياناتك الشخصية للأغراض التطوعية.</li>
                            <li>تلقي رسائل وإشعارات عبر البريد الإلكتروني أو الهاتف المحمول بخصوص الأنشطة التطوعية.</li>
                            <li>الالتزام بقواعد وأنظمة العمل التطوعي في الوزارة.</li>
                            <li>صحة جميع البيانات المقدمة في النموذج.</li>
                        </ul>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
                            />
                            <span className="text-gray-700 dark:text-gray-200">
                                أوافق على الشروط والأحكام المذكورة أعلاه
                            </span>
                        </label>
                    </div>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-md ${
                        status.type === 'success' ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200' :
                        status.type === 'error' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200' :
                        'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200'
                    }`}>
                        {status.message}
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                            formData.acceptTerms 
                            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white' 
                            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400'
                        }`}
                        disabled={!formData.acceptTerms}
                    >
                        إرسال
                    </button>
                </div>
            </form>
        </div>
    );
}