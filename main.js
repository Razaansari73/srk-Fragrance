$(document).ready(function() {
    // Mobile nav toggle
    $('#menu-toggle').click(() => $('.main-nav').toggleClass('show'));

    // Product filter
    $('.filter-btn').click(function() {
        const filter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        $('.product-card').toggle(filter === 'all' || $(this).data('filter') === filter);
    });
});

localStorage.setItem('contactFormData', JSON.stringify(data));