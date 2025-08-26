$(document).ready(function() {
    // =================================================================
    // CONFIGURAÇÕES GERAIS
    // =================================================================
    const header = $('header');
    const sections = $('section');
    const navItems = $('.nav-item');
    const mobileBtn = $('#mobile_btn');
    const mobileMenu = $('#mobile_menu');

    // =================================================================
    // FUNÇÃO PRINCIPAL QUE ATUALIZA A PÁGINA AO ROLAR
    // =================================================================
    function updatePageOnScroll() {
        const scrollPosition = $(window).scrollTop() + header.outerHeight();
        let activeSection = sections.first();

        sections.each(function() {
            const currentSection = $(this);
            const sectionTop = currentSection.offset().top;
            const sectionBottom = sectionTop + currentSection.outerHeight();
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = currentSection;
                return false;
            }
        });

        const activeSectionIdForNav = activeSection.attr('id');
        navItems.removeClass('active');
        navItems.find('a[href="#' + activeSectionIdForNav + '"]').parent().addClass('active');

        const activeSectionId = activeSection.attr('id');
        const transparentHeaderSections = ['home', 'menu', 'testimonials'];
        const currentIdLower = activeSectionId ? activeSectionId.toLowerCase() : '';

        if (transparentHeaderSections.includes(currentIdLower)) {
            header.removeClass('scrolled');
        } else {
            header.addClass('scrolled');
        }
    }

    // =================================================================
    // EVENTOS
    // =================================================================
    $(window).on('scroll', updatePageOnScroll);
    updatePageOnScroll();

    // Evento de CLIQUE no menu mobile
    mobileBtn.on('click', function() {
        mobileMenu.toggleClass('active');
        mobileBtn.find('i').toggleClass('fa-bars fa-x');
        header.toggleClass('menu-open'); // <-- AJUSTE ADICIONADO AQUI
    });

    // Evento de CLIQUE nos itens do menu para fechar o menu mobile
    $('#mobile_menu .nav-item, #nav_list .nav-item').on('click', function() {
        if (mobileMenu.hasClass('active')) {
            mobileMenu.removeClass('active');
            mobileBtn.find('i').removeClass('fa-x').addClass('fa-bars');
            header.removeClass('menu-open'); // <-- AJUSTE ADICIONADO AQUI
        }
    });

    // =================================================================
    // ANIMAÇÕES COM SCROLLREVEAL
    // =================================================================
    ScrollReveal().reveal('#cta', { origin: 'left', duration: 2000, distance: '20%' });
    ScrollReveal().reveal('.dish', { origin: 'left', duration: 2000, distance: '20%' });
    ScrollReveal().reveal('#testimonials_content', { origin: 'left', duration: 1000, distance: '20%' });
});