// General conditions text (page 2 of the contract), French + Arabic.

export type Article = { title: string; items: string[]; plain?: boolean };

export const CONDITIONS_FR: Article[] = [
  {
    title: "Article 1 : utilisation de voiture",
    items: [
      "Le locataire s'engage à ne pas laisser conduire la voiture que ceux spécifiés dans le contrat.",
      "Ne pas utiliser le véhicule à des fins illicites ou pour le transport de marchandises interdites: le remorquage ou le transport des personnes à contre partie.",
      "Ne pas utiliser le véhicule dans les pistes.",
    ],
  },
  {
    title: "Article 2 : Etat de voiture",
    items: [
      "Le véhicule est livré en parfait état de propreté, mécanique, électrique et pneumatique: doit être rendu dans le même état.",
      "Le nombre de kilomètre autorisé par jour est fixé à 250 km dans le cas où le locataire dépasse le nombre autorisé, 1,40 dirhams par km est payé.",
      "La sté dégage toute sa responsabilité sur l'indemnité de la panne du véhicule.",
      "Le locataire n'a pas le droit à une voiture de remplacement.",
    ],
  },
  {
    title: "Article 3 : Entretiens et réparations",
    items: [
      "Toute opération d'entretien ou réparation, prévu de véhicule doit être accordé par l'agence de location soit par e-mail ou SMS.",
      "Le locataire doit vérifier les niveaux (huile, eau, lumières, feux) si la durée dépasse 24 heures en sa possession.",
      "Toute panne causée par la négligence du client la facturation sera à sa charge.",
      "L'agence n'est pas responsable des violations liées aux feux de la voiture, ni de l'absence des moyens de signalisation (triangle de faute).",
    ],
  },
  {
    title: "Article 4 : Assurance",
    items: [
      "Assurance Responsabilité civile uniquement, le locataire assume l'entière responsabilité concernant la réparation de la voiture pendant toute la période de réparation.",
      "Le locataire doit immédiatement informer l'agence de location en cas d'accident.",
    ],
  },
  {
    title: "Article 5 : location prolongation",
    items: [
      "Le paiement de location est payable à l'avance de location. Faute de cela le locataire est responsable de tous les frais causés par négligence.",
      "En cas de prolongation le locataire doit aviser 02 Jours à l'avance.",
      "Le locataire doit rendre le véhicule en temps réel de la livraison. Pour tout retard plus de 2 heures, une journée sera facturée.",
      "La société se réserve le plein droit de mettre fin au statut de contrat sans justification ni donne ni compensation ne rembourse pas dans le cas où le locataire n'a pas respecté les termes de ce contrat.",
      "Dans le cas d'un retour avant le terme, le locataire n'a pas le droit d'aucun remboursement.",
      "Dans le cas d'une prolongation de contrat non autorisé par l'agence le locataire est tenu de payer une somme forfaitaire de 100 dh pour chaque heure retard.",
    ],
  },
  {
    title: "Article 6 : Papiers de la voiture",
    plain: true,
    items: [
      "En cas de perte des papiers de voiture toutes les charges et les frais sont à la charge du locataire, (immobilisation du véhicule renouvellement de papier...)",
    ],
  },
  {
    title: "Article 7 : Responsabilité",
    items: [
      "Le locataire est responsable des amendes contraventions et procès-verbaux établis contre lui par les autorités.",
      "L'agence ne prend pas une infraction libérée par les autorités concernant les feux de voiture mal fonctionné pendant la période de location.",
      "Le conducteur restera le responsable financièrement des dommages causés au véhicule dans le cas où la conduite sous l'emprise de l'alcool, drogue, ou médicaments interdit lors de conduite.",
      "Le locataire ne doit pas renoncer à la voiture, quelle que soit les raisons d'arrêt.",
      "Le paiement anticipé ne peut être remboursé ni réclamé dans les cas suivant: Retard - Annulation - Changement.",
      "La société a le droit de récupérer le véhicule loué si c'est prouvé par une contravention ou un pv que le chauffeur a dépassé la vitesse déclarée par la loi routière.",
      "Le client doit assumer la responsabilité de rembourser tout dégât matériel en cas d'accident et d'absence de permis de conduire à cause d'une contravention, pv, ect...",
      "Si le locataire dépasse la vitesse autorisée de 50 km/h la vitesse légalement prescrite permet à l'entreprise de récupérer la voiture sans justification ni indemnité au locataire.",
    ],
  },
  {
    title: "Article 8 :",
    plain: true,
    items: [
      "Tous les droits du locataire qui lui sont accordés en vertu du présent contrat seront exclus dans le cas d'accident ou de cas de non-respect d'un acte de contrat, sans prétendre à aucune indemnité pour la durée restante du contrat de location ni à la demande du changement du véhicule.",
      "En cas d'accident dans lequel le conducteur est quelqu'un d'autre que celui qui a loué la voiture, la société n'est pas responsable de ce qui s'est passé. Le locataire est responsable de tous les dommages résultant de cet accident.",
    ],
  },
];

export const CONDITIONS_AR: Article[] = [
  {
    title: "البند 1: استعمال السيارة",
    items: [
      "لا يسمح بسياقة السيارة الا من طرف الأشخاص المحددة أسمائهم في العقد.",
      "لا يسمح بسياقة السيارة لأغراض غير مشروعة (نقل البضائع الممنوعة، جر العربات أو نقل الأشخاص بمقابل).",
      "يمنع استعمال السيارة في الطرق الغير معبدة.",
    ],
  },
  {
    title: "البند 2: حالة السيارة",
    items: [
      "تسلم السيارة في حالة جيدة (النظافة، الحالة الميكانيكية، الأضواء، العجلات) على أن تعاد في نفس الظروف. يحدد عدد الكيلومترات المسموح بها في اليوم الواحد ب 250 كلم وفي حالة تجاوز المستأجر للعدد المسموح به يؤدي 1,40 درهم للكيلومتر الواحد. والوكالة ليست مسؤولة على أي تعويض ناتج عن عطب في السيارة. وليس للمستأجر الحق في الطلب بتبديل السيارة.",
    ],
  },
  {
    title: "البند 3: الصيانة والإصلاح",
    items: [
      "لا يمكن القيام بأية عملية صيانة أو إصلاح بالسيارة الا بعد الحصول على موافقة وكالة التأجير عن طريق الفاكس أو البريد الإلكتروني.",
      "يجب على المستأجر التحقق من مستويات (زيت المحرك، الماء، أضواء السيارة، مراقبة العجلات) إذا تجاوزت 24 ساعة وهي في حوزته.",
      "أي عطب ناجم عن اللامبالاة من طرف المستأجر يلزمه أداء كل النفقات المترتبة عن ذلك.",
      "الوكالة ليست مسؤولة عن المخالفات المتعلقة بأضواء السيارة أو غياب وسائل التشوير (مثلث الأعطاب).",
    ],
  },
  {
    title: "البند 4: التأمين",
    items: [
      "التأمين على المسؤولية المدنية فقط إذ أن المكتري يتحمل كل المسؤولية المتعلقة بإصلاح السيارة في حالة وقوع حادثة، بالإضافة إلى المصاريف الناتجة عن توقف السيارة خلال فترة الإصلاح.",
      "يجب على المستأجر إخبار وكالة الكراء فور حدوث حادثة سير.",
    ],
  },
  {
    title: "البند 5: التمديد",
    items: [
      "يؤدى مسبقا المبلغ الإجمالي للإيجار.",
      "لا يمكن تمديد عملية الإيجار إلا بموافقة الوكالة وإلا سيتحمل المستأجر كل المصاريف الناتجة عن هذا الإهمال.",
      "في حالة التمديد يتعين على المستأجر إخبار الوكالة يومين قبل ذلك. يجب على المستأجر ارجاع السيارة في الوقت المحدد وأي تأخر (في حدود ساعتين) يحتسب يوما إضافيا يؤديه المستأجر.",
      "تحتفظ الشركة بكامل حق وضع نهاية العقد دون تبرير ولا تعويض ولا سداد في حالة ما إذا لم يحترم المكتري أحد بنود هذا العقد.",
      "في حالة ارجاع سابق لأوانه لا يمكن للمكتري أن يطالب بأي تسديد أو تخفيض.",
      "في حالة انتهاء مدة العقد وعدم تمديده من طرف الشركة يبقى المكتري ملتزما بتأدية غرامة جزافية مقدارها 100 درهم عن كل ساعة تأخر إلى حين استرجاع السيارة.",
    ],
  },
  {
    title: "البند 6: أوراق السيارة",
    items: [
      "في حالة فقدان وثائق السيارة يبقى المستأجر هو المسؤول عن تكاليف إنجاز الأوراق وعن أيام توقف السيارة.",
    ],
  },
  {
    title: "البند 7: المسؤولية",
    items: [
      "يبقى المستأجر المسؤول الوحيد عن الغرامات والمخالفات وكل المحاضر المحررة ضده من قبل السلطات المعنية.",
      "الوكالة لا تتحمل أي مخالفة حررت من طرف السلطات المعنية تتعلق بعطب في السيارة خلال المدة المكتراة.",
      "يبقى السائق مسؤولا ماليا عن الأضرار التي لحقت السيارة خلال مدة الكراء عند القيادة تحت تأثير الكحول أو المخدرات أو الأدوية المحظورة أثناء السياقة.",
      "يلتزم المكتري بعدم التخلي عن السيارة مهما كانت أسباب توقفها.",
      "لا يمكن استرجاع أو المطالبة بالمبلغ المسبق للحجز في الحالات التالية: التأخر، الالغاء، تغيير نوع السيارة.",
      "يحق للشركة استرجاع السيارة المكتراة في حالة ما حرر أو ثبت في حق المكتري تجاوز السرعة المحددة قانونيا بمخالفة أو محضر رسمي.",
      "يتحمل الزبون كل الخسائر في حالة وقوع حادثة وعدم توفره على رخصة السياقة لسحبها منه لمخالفة أو غيرها.",
      "في حالة تجاوز المكتري السرعة المحددة قانونيا ب 50 km/h يخول للشركة استرجاع السيارة بدون تبرير وليس للمكتري الحق في المطالبة بالمستحقات المتبقية.",
    ],
  },
  {
    title: "البند 8: سقوط حق المكتري",
    items: [
      "تسقط كافة حقوق المكتري الممنوحة له بمقتضى هذا العقد في حالة وقوع حادثة أو عدم احترامه لأي بند من هذا العقد مع عدم المطالبة بأي تعويض على المدة المتبقية أو تغيير السيارة.",
      "في حالة وقوع حادثة يكون فيها السائق شخص آخر غير مذكور في العقد فإن الشركة ليست مسؤولة عن ما حدث والمكتري هو الذي يتحمل جميع الأضرار الناتجة عن هذا الحادث.",
    ],
  },
];